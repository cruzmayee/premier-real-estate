const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const admin = require("firebase-admin");
const serviceAccount = require("./login-ffaac-firebase-adminsdk-d4a5z-f5cebb4f4d.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://login-ffaac-default-rtdb.firebaseio.com/",
});

exports.user_signup = (req, res, next) => {
  User.find({
    email: req.body.email,
  })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result)
                const user = {
                  name: req.body.name,
                  email: req.body.email,
                  password: req.body.password,
                };
                const userResponse = admin
                  .auth()
                  .createUser({
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    emailVerified: false,
                    disabled: false,
                  })
                  .then((resp) => {
                    res.status(201).json({
                      message: "User Created",
                      resp,
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              name: user[0].name,
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "24h",
            },
          );

          return res.status(200).json({
            message: "Auth Successful",
            token: token,
            userId: user[0]._id
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.getUser = (req, res, next) => {
 User.find({
   _id: req.params.userId
 }) 
  .exec()
  .then((user) => {
    if (user.length >= 1) {
      return res.status(200).json({
        message: "Mail exists",
        user
      });
    }
    else {
      return res.status(404).json({
        message: "User not found"
      })
    }
  })
}
exports.editUser = (req, res, next) => {
  const id = req.params.userId
 User.findOneAndUpdate({ _id: id }, { $set: req.body }) 
  .exec()
  .then((result) => {
    res.status(200).json({
       message: "User updated",
       request: {
         type: "Update",
         url: `tae/user/${id}`,
       },
     });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
}
