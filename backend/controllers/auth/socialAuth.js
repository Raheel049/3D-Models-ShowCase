import refreshTokenModel from '../../models/auth/refreshToken.js'
import { createSession } from '../../utils/createSession.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken.js';

export const googleLogin = async (req, res) => {
    try {
  
      const user = req.user;
  
      const accessToken = generateAccessToken(user._id);
  
      const refreshToken = generateRefreshToken(user._id);
  
      
      await refreshTokenModel.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      await createSession(user, refreshToken, req)
  
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
  
      return res.redirect("http://localhost:5173/");
  
    } catch (error) {
  
      return res.status(500).json({
        message: error.message,
        status: false,
      });
  
    }
  };


  //github login
  export const githubLogin = async (req, res) => {
    try {
  
      const user = req.user;
  
      const accessToken = generateAccessToken(user._id);
  
      const refreshToken = generateRefreshToken(user._id);
  
      await refreshTokenModel.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
  
      await createSession(user, refreshToken, req);
      
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
  
      return res.status(200).json({
        message: "GitHub Login Successful",
        status: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          provider: user.provider,
        },
      });
  
    } catch (error) {
  
      return res.status(500).json({
        message: error.message,
        status: false,
      });
  
    }
  };