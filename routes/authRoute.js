import express  from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {registerController, 
    loginController,
     textController,
     forgotPasswordController,
     updateProfileController,
     getOrdersController,
     getAllOrdersController,
     orderStatusController} from "../controllers/authController.js"
import { updateProductController } from "../controllers/productController.js";
const router = express.Router();

router.post('/register',registerController)

//login
router.post('/login',loginController)

//forget passpord /|| POST
router.post("/forgot-password", forgotPasswordController)

//next route
router.get("/text", requireSignIn,isAdmin, textController);

//protect route dashbord route
router.get('/user-auth', requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})


//protect route admin route
router.get('/admin-auth', requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
})

//update profile
router.put('/profile', requireSignIn, updateProfileController)


//orders
router.get('/orders', requireSignIn, getOrdersController)



//allorders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)

//order status update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController)
export default router;