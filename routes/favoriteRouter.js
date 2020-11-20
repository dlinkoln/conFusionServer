var express = require('express');
const bodyParser = require('body-parser')
const cors = require('./cors')
const Favorites = require('../models/favorite')
const Dishes = require('../models/dishes')
var passport = require('passport')

var authenticate = require('../authenticate')
var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json())



favoriteRouter.route('/')
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }).populate('user').populate('dishes').then((favorites) => {
      if (favorites != null) {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json')
        res.json(favorites)
      }
      else {
        res.end(favorites)
      }

    })
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.updateOne({ user: req.user._id }, {
      $addToSet: {
        dishes: {
          $each: req.body.map(el => el._id)
        }
      },
    }, { upsert: true })
      .then((favDoc) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(favDoc)
      })
      .catch((err) => next(err))
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndDelete({ user: req.user._id })
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, err => next(err))
      .catch((err) => next(err))
  })

favoriteRouter.route('/:dishId')
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('GET operation not supported on /favorites/dishId')
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.updateOne({ user: req.user._id }, {
      $addToSet: {
        dishes: req.params.dishId
      },
    }, { upsert: true }).then((favDoc) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(favDoc)
    })
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.updateOne(
      { user: req.user._id },
      {
        $pull: {
          dishes: {
            $in: req.params.dishId
          }
        }
      }
    ).then((favDoc) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(favDoc)
    }).catch((err) => next(err))
  })

module.exports = favoriteRouter;
