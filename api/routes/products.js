const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require("../middleware/check-auth");
const ProductsController = require("../controllers/products");

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null,path.join(__dirname, 'uploads/'));
//     },
//     filename: function(req, file,cb){
//         // const date = new Date().toISOString()
//         cb(null, file.originalname);
//     }
// });
// const storage = multer.memoryStorage()
// const upload = multer({storage: storage})

// const fileFilter = (req, file, cb) =>{
//     // reject a file
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
//         cb (null, true);
//     } else{
//         cb (null, false);
//     }
// };
//
// const upload = multer({
//     storage: storage,
// limits:{
//     fileSize: 1024 * 1024 * 5
// },
// fileFilter: fileFilter
// });

router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, ProductsController.products_create_product);

router.get("/:productID", checkAuth, ProductsController.products_get_product);

router.patch(
  "/:productID",
  checkAuth,
  ProductsController.products_update_product,
);

module.exports = router;
