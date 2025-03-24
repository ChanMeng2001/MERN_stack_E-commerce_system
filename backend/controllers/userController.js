import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js'
import bcrypt from 'bcryptjs';

const createUser = asyncHandler(async (req,res) => {
     const { username, email, password } = req.body;

     //check if input is empty
     if(!username || !email || !password){
          res.status(400).send("Please fill in all the inputs");
          // throw new Error("Please fill in all the inputs");
     }

     //check if email already exist in database
     const userExist = await User.findOne({email});
     if(userExist){
          res.status(400).send("User already exist");
          // throw new Error("User already exist");
     }

     //hash password
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);

     //cannot write {username, email, hashedPassword}
     //because Mongoose expects the field names to match the schema, 
     //and your schema likely defines password as the field name, not hashedPassword.
     const newUser = new User({username, email, password: hashedPassword});
     try {
          await newUser.save();
          res.status(201).json({
               _id: newUser._id,
               username: newUser.username,
               email: newUser.email,
               password: newUser.password,
               isAdmin: newUser.isAdmin
          })
     } catch (error) {
          res.status(400);
          throw new Error("Invalid user data:",error.message)
     }
});


export {createUser};