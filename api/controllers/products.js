const Product = require("../models/product");
const mongoose = require("mongoose");
// const fs = require("fs");

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id productImage address status property _user details")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            address: doc.address,
            status: doc.status,
            property: doc.property,
            _id: doc._id,
            _user: doc._user,
            details: doc.details,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      //if (docs.length>=0{
      res.status(200).json(response);
      //}else{
      //  res.status(404)
      //}
      //res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.products_create_product = (req, res, next) => {
  // const imageBuffer = fs.readFileSync(req.file.path);
  // const imageBuffer = req.file.buffer

  // Convert the image data to base64
  // const imageData = imageBuffer.toString("base64");
  console.log(req.body.userId)
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.body.productImage,
    address: req.body.address,
    property: req.body.property,
    status: req.body.status,
    _user: req.body.userId,
    details: req.body.details
  });
  console.log(product);

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          address: result.address,
          property: result.property,
          status: result.status,
          _id: result._id,
          _user: result._user,
          details: result.details,
          request: {
            type: "POST",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .select("name price _id productImage address status property _user details")
    .exec()
    .then((result) => {
      console.log("From Database", result);
      if (result) {
        res.status(200).json({
          message: "Product retrieved successfully",
          retrievedProduct: {
            name: result.name,
            price: result.price,
            status: result.status,
            property: result.property,
            address: result.address,
            _id: result._id,
            _user: result._user,
            details: reqult.details,
            request: {
              type: "GET",
              url: "http://locahost:3000/products" + result._id,
            },
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productID;
  const updateOps = {};
  Product.findOneAndUpdate({ _id: id }, { $set: req.body })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "Update",
          url: "http://locahost:3000/products" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
