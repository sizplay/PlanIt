const router = require('express').Router();
const { Plan, Place, Recommendation } = require('../../db').models;
const { auth, checkUser } = require('../authFuncs');

router.get('/',  (req, res, next) => {
  Plan.findAll()
    .then(plans => res.send(plans))
    .catch(next);
});

router.post('/',  (req, res, next) => {
  Plan.create(req.body)
    .then(plan => res.send(plan))
    .catch(next);
});

router.put('/:id',  (req, res, next) => {
  Plan.findById(req.params.id)
    .then(plan => {
      plan.update(req.body);
      res.send(plan);
    })
    .catch(next);
});

router.post('/:planId/user/:userId/recommend', auth, (req, res, next) => {
  let place;
  Place.findOrCreatePlace(req.body)
  .then(() => {
   return Place.findOne({where: { place_id: req.body.place_id }})
     .then(_place => {
      place = _place;
    });
  })
  .then(()=>{
    return Recommendation.create({
      userId: req.params.userId,
      planId: req.params.planId*1,
      placeId: place.id});
  })
  .then(rec => {
    res.send(Object.assign({}, rec, place))
  })
  .catch(next);
});


router.delete('/:id', [auth, checkUser], (req, res, next) => {
  Plan.findById(req.params.id)
    .then(plan => {
      plan.destroy();
      res.sendStatus(204);
    })
    .catch(next);
});

module.exports = router;
