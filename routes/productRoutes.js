import express, { Router }  from "express";
import formidable from "express-formidable"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { ProductCategoryController, braintreePayemtController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCountController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js";
const router = express.Router()

//routes 
router.post("/create-product", requireSignIn, isAdmin,formidable(),createProductController)

//updateproduct
router.put("/update-product/:pid", requireSignIn, isAdmin,formidable(),updateProductController)


//get product
router.get("/get-product", getProductController)

//single product
router.get("/get-product/:slug", getSingleProductController)

//getphoto
router.get("/product-photo/:pid", productPhotoController)

//deleteproduct
router.delete("/delete-product/:pid", deleteProductController)
 
//filetr product
router.post('/product-filters',productFiltersController)

//product count 
router.get('/product-count',productCountController)

//product per page
router.get('/product-list/:page',productListController)

//serch product
router.get('/search/:keyword',searchProductController)

//simler prodycr
router.get("/related-product/:pid/:cid",relatedProductController)

//category wse products
router.get("/product-category/:slug",ProductCategoryController)

//payment route
router.get("/braintree/token", braintreeTokenController)


//payment 
router.post("/braintree/payment", requireSignIn, braintreePayemtController)

export default router
