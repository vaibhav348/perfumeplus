import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        //validation
        if (!name) {
            return res.send({ message: "name is require" })
        }
        if (!email) {
            return res.send({ message: "email is require" })
        }
        if (!password) {
            return res.send({ message: "password is require" })
        }
        if (!phone) {
            return res.send({ message: "phone is require" })
        }
        if (!address) {
            return res.send({ message: "address is require" })
        }

        if (!answer) {
            return res.send({ message: "answer is require" })
        }
        //chack user
        const existinguser = await userModel.findOne({ email })
        //existing user
        if (existinguser) {
            return res.status(200).send({
                success: false,
                message: 'already register plese login'
            })
        }
        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save()

        res.status(201).send({
            success: true,
            message: 'user register successfully',
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in registration",
            error
        })
    }
}

//login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "invalid email or password"
            })
        }
        //chack user 
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "email is not register"
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "invalid password"
            })
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });





    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in login",
            error
        })
    }
}

//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            res.status(400).send({ message: 'email is required' })
        }
        if (!answer) {
            res.status(400).send({ message: 'answer is required' })
        }
        if (!newPassword) {
            res.status(400).send({ message: 'newPassword is required' })
        }
        //chack

        const user = await userModel.findOne({ email, answer })
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "somthig went wrong"
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "password reset successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "sonthing gwent wronge",
            error
        })
    }
}




export const textController = (req, res) => {
    try {
        res.send('protected route')
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
}

//updateProfileController
export const updateProfileController = async (req, res) => {

    try {
        const { email, name, phone, password, address } = req.body
        const user = await userModel.findById(req.user._id)
if(password && password.length<6){
    return res.json({error:"password is require and 6 cheracter long"})
}

const hashedPassword = password ? await hashPassword(password) : undefined

const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
name:name || user.name,
password:hashedPassword || user.password,
phone:phone || user.phone,
address:address || user.address
},{new:true})
res.status(200).send({
    success:true,
    message:"profile updated successfully",
    updatedUser
})
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while update profile",
            error
        })
    }


} 


//getOrdersController
export const getOrdersController =async(req,res)=>{
    try {
        const orders = await orderModel.find({buyer:req.user._id}).populate("buyer","name")
        res.json(orders)

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error while geting orders",
            error
        })
    }
}

//getAllOrdersController
export const getAllOrdersController =async(req,res)=>{
    try {
        const orders = await orderModel.find({}).populate("buyer","name")
        res.json(orders)

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error while geting orders",
            error
        })
    }
}

//orderStatusController
export const orderStatusController=async(req,res)=>{
    try {
        const {orderId } = req.params
        const {status} = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders)

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error while updating orders",
            error
        })
    }
}