import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";

// middleware confirm need receive next
const authenticate = asyncHandler(async (req, res, next) => {
     let token;

     token = req.cookies.jwt;

     if (token) {
          try {
               const decoded = await jwt.verify(token, process.env.JWT_SECRET);
               req.user = await User.findById(decoded.userId).select("-password"); // get all user info except password
               next();
          } catch (error) {
               res.status(401);
               throw new Error("Not authorized. Token failed:", error.message);
          }
          

     }
     else
     {
          res.status(401).json({
               message: "Not authenticate. Token not exist",
          })
     }
})

const authorizeAdmin = asyncHandler(async (req,res,next) => {
     //if have user and user is admin
     if(req.user && req.user.isAdmin){
          next();
     }
     else
     {
          res.status(401);
          throw new Error("Not authorize admin");
     }
})

export {authenticate, authorizeAdmin};