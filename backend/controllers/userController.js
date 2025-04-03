import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js'
import bcrypt from 'bcryptjs';
import generateToken from '../utils/createToken.js';

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

          // after insert new record into db, generate token and assign to user
          generateToken(res, newUser._id);


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

const loginUser = asyncHandler(async (req,res) => {
     const { email, password } = req.body;

     const existingUser = await User.findOne({ email });

     if(existingUser) {
          const isPasswordValid = await bcrypt.compare(password, existingUser.password);

          if(isPasswordValid) {
               generateToken(res, existingUser._id);

               
               return res.status(201).json({
                    _id: existingUser._id,
                    username: existingUser.username,
                    email: existingUser.email,
                    password: existingUser.password,
                    isAdmin: existingUser.isAdmin,
               });
          } 
          else 
          {
               res.status(401).send("Incorrect Login credential");
          }
     }
     else 
     {
          res.status(401).send("Incorrect Login credential");
     }
})

const logoutUser = asyncHandler(async (req,res) => {
     res.cookie('jwt', '', {
          httpOnly: true,
          expires: new Date(0),
     });

     res.status(200).json({
          message: "Logout successfully",
     });

})

const getAllUsers = asyncHandler(async (req,res) => {
     const users = await User.find({});
     res.json(users);
})

const getCurrentUserProfile = asyncHandler(async (req, res) => {
     const user = await User.findById(req.user._id);

     if(user){
          res.json({
               _id: user._id,
               username: user.username,
               email: user.email,
               isAdmin: user.isAdmin
          })
     }
     else{
          res.status(404).json({
               message: "User not found"
          })
     }
})

export {createUser, loginUser, logoutUser, getAllUsers, getCurrentUserProfile};