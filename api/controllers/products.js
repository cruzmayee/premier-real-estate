const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs=>{
        const response={
            count:docs.length,
            products: docs.map(doc=>{
                return{
                    name:doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request:{
                        type:'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        };
        //if (docs.length>=0{
            res.status(200).json(response);
        //}else{
        //  res.status(404)
        //}
        //res.status(200).json(docs);

    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })
}

exports.products_create_product = (req, res, next)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price:req.body.price,
        productImage: req.file.path,
        address: req.file.path,
        property: req.file.path,
        status: req.file.path
    });
    console.log(product)

    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct:{
                name:result.name,
                price:result.price,
                address:result.address,
                property: result.property,
                status: result.status,
                _id:result._id,
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(result => {
        console.log("From Database",result); 
        if (result) {
            res.status(200).json({
                message: 'Product retrieved successfully',
                retrievedProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://locahost:3000/products' + result._id
                }
            }
            });
        } else {
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.findOneAndUpdate({_id: id}, { $set: updateOps }).exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'Update',
                url: 'http://locahost:3000/products' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}