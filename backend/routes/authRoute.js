import express from 'express'
import { loginHandler, logoutHandler, forgetPassword, changePassword, refreshTokenHandler, signUpHandler, resendOtpHandler, verificationHandler, getMe, } from '../controllers/auth/auth.js';
import passport from '../config/passport.js'
import { googleLogin, githubLogin } from "../controllers/auth/socialAuth.js";
import { authMiddleware } from '../middleware/middleware.js';

const authRoute = express.Router();

authRoute.post('/signup', signUpHandler);

authRoute.post('/login', loginHandler);

authRoute.post('/refresh-token', refreshTokenHandler);

authRoute.post('/logout', logoutHandler);

authRoute.post('/resend-otp', resendOtpHandler);

authRoute.post('/verify-otp', verificationHandler);

authRoute.post("/forget-password", forgetPassword);

authRoute.post("/change-password", changePassword);

authRoute.get("/me", authMiddleware, getMe)

authRoute.get(
  "/google",

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

authRoute.get(
  "/google/callback",

  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),

  googleLogin
);


//git hub login routes
authRoute.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

authRoute.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "http://localhost:5173/login",

  }),
  githubLogin
);

// authRoute.get("/checkRequest", checkReq)

export default authRoute