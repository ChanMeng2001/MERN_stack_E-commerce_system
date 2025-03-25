import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
     // this token contains userId, process.env.JWT_SECRET is to sign the userId
     const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d", });

     // set jwt as an http-only cookie
     res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV != "development",
          sameSite: 'strict', // Prevents cross-site request forgery (CSRF) attacks.
          maxAge: 60 * 60 * 24 * 30 * 1000, // The cookie lasts 30 days (in milliseconds).
     })

     return token;
}

export default generateToken;