const express = require('express');
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const Leaders = require('../models/leaders')

const leaderRourer = express.Router()
leaderRourer.use(bodyParser.json());

leaderRourer.route('/')
  .get((req, res, next) => {
    Leaders.find({})
      .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json')
        res.json(leaders)
      }, err => next(err))
      .catch((err) => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body)
      .then((leader) => {
        console.log("leader Created", leader)
        res.statusCode = 200
        res.setHeader('Content-type', 'application/json')
        res.json(leader)
      }, err => next(err))
      .catch((err) => next(err))
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /leaders')
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json')
        res.json(resp)
      }, err => next(err))
      .catch(err => next(err));
  })

leaderRourer.route('/:leaderId')
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json')
        res.json(leader)
      }, err => next(err))
      .catch((err) => next)
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /leaders/${req.params.leaderId}`)
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
      $set: req.body
    }, { new: true })
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json')
        res.json(leader)
      }, err => next(err))
      .catch((err) => next(err))
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json')
        res.json(resp)
      }, err => next(err))
      .catch(err => next(err));
  })

module.exports = leaderRourer