var express = require("express");
var bodyParser = require("body-parser");
var jwt        = require("jsonwebtoken");
var mongoose   = require("mongoose");
var User       = require('./model');
var cfg        = require('./config');
var auth       = require('./auth');
var app        = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.post('/authenticate', function(req, res) {
  User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
          if (err) {
              res.json({
                  type: false,
                  data: "Error occured: " + err
              });
          } else {
              if (user) {
                 res.json({
                      type: true,
                      data: user,
                      token: user.token
                  });
              } else {
                  res.json({
                      type: false,
                      data: "Incorrect email/password"
                  });
              }
          }
      });
});

app.post('/signin', function(req, res) {
  User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, cfg.jwtSecret);
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                })
            }
        }
    });
});

//Rota privada
app.get('/me', auth, function(req, res) {
  User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                type: true,
                data: user
            });
        }
    });
});

app.listen(3000, () => {
  console.log('Rodando em 3000');
})
