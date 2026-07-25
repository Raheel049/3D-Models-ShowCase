import userModel from "../../models/auth/auth.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";
import sessionModel from "../../models/auth/session.js";
import { createSession } from "../../utils/createSession.js";
import refreshTokenModel from "../../models/auth/refreshToken.js";
import otpModel from '../../models/auth/otpSchema.js'



export const signUpHandler = async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;
  try {
    if (!name || !phoneNumber || !email || !password) {
      return res.status(400).json({
        message: "Required fields are missing",
        status: false,
        data: null,
      });
    }

    const userData = await userModel.findOne({ email });

    if (userData) {
      return res.status(404).json({
        message: "User already exist",
        status: false,
        data: null,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    // console.log(hashPassword);

    const userObj = {
      ...req.body,
      password: hashPassword,
    };

    // console.log(userObj);

    const user = await userModel.create(userObj);




    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const OTP = uuidv4().slice(0, 6);
    // console.log(OTP);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP code for verification!",
      html: `
         <div style="font-family: Arial; background:#f4f4f4; padding:20px;">
      <div style="max-width:400px; margin:auto; background:#fff; padding:20px; border-radius:8px; text-align:center;">
        <h2 style="color:#333;">Verify Your Email</h2>
        <p>Your OTP code is:</p>
        <a 
          style="
            display:inline-block;
            padding:12px 24px;
            background:#4CAF50;
            color:#fff;
            text-decoration:none;
            font-size:18px;
            border-radius:6px;
            margin:10px 0;
          "
        >
          ${OTP}
        </a>
        <p style="font-size:12px;color:#777;">This code will expire in 5 minutes.</p>
      </div>
    </div>
        `,
    });

    const OTPObj = {
      email: email,
      otp: OTP,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    };

    await otpModel.create(OTPObj);

    const resData = {
      name,
      email,
      phoneNumber,
    };

    res.status(200).json({
      message: "User register successfully ",
      status: true,
      data: resData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: false,
      data: null,
    });
  }
};

export const loginHandler = async (req, res) => {
  try {
    console.log("login api hit")
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Required fields are missing",
        status: false,
        data: null,
      });
    }

    const user = await userModel.findOne({ email });


    if (!user) {
        return res.status(404).json({
          message: "Invalid email and password",
          status: false,
          data: null,
        });
    }

    if(!user.isVerified){
      return res.status(404).json({
        message: "Unverified email and password please verify your email first",
        status: false,
        data: null,
      });
    }

   


    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(401).json({
        message: "Invalid email or password!",
        data: null,
        status: false,
      });
    }

    const accessToken = generateAccessToken(user._id);

    console.log(accessToken,"accessToken")


    const refreshToken = generateRefreshToken(user._id);

    await refreshTokenModel.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Create Session
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
      message: "Login Successfully",
      status: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: false,
      data: null,
    });
  }
};

export const refreshTokenHandler = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const storedToken = await refreshTokenModel.findOne({
      token,
      user: decoded.id,
    });

    if (!storedToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const session = await sessionModel.findOneAndUpdate(
      {
        refreshToken: token,
      },
      {
        lastActive: new Date(),
      }
    );

    if (!session) {
      return res.status(401).json({
        message: "Session not found",
        status: false,
      });
    }

    const accessToken = generateAccessToken(decoded.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Access token refreshed",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: false,
      data: null,
    });
  }
};

export const logoutHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await refreshTokenModel.deleteOne({
        token: refreshToken,
      });

      await sessionModel.deleteOne({
        refreshToken: refreshToken,
      });
    
    }

    

    res.clearCookie("accessToken");

    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Logout Successfully",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const verificationHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Required fields are missing",
        status: false,
        data: null,
      });
    }

    const isExists = await otpModel.findOne({ email, isUsed: false }).sort({ createdAt: -1 });

      

    if (!isExists) {
      return res.status(401).json({
        message: "OTP not exists",
        data: null,
        status: false,
      });
    }

    if (isExists.otp !== otp) {
      return response.status(401).json({
        message: "You have entered wrong OTP",
        data: null,
        status: true,
      });
    }

    if(new Date(isExists.expiresAt).getTime() <= Date.now()){
      return response.status(401).json({
        message: "You OTP has expired",
        data: null,
        status: false,
      });
    }

    await otpModel.findByIdAndUpdate(isExists._id, { isUsed: true });
    await userModel.findOneAndUpdate({ email: email }, { isVerified: true });

    res.status(200).json({
      message: "Verified Successfully",
      data: email,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: false,
      data: null,
    });
  }
};

export const resendOtpHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Required fields are missing",
        status: false,
        data: null,
      });
    }


        const user = await userModel.findOne({ email });

        if(user.isVerified==true){
          return res.status(400).json({
            message: "Email Already Verified",
          status: false,
            data: null,
      });
        }
        // console.log(user.isVerified)


    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: "465",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const OTP = uuidv4().slice(0, 6);
    // console.log(OTP);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP code for verification!",
      html: `
         <div style="font-family: Arial; background:#f4f4f4; padding:20px;">
      <div style="max-width:400px; margin:auto; background:#fff; padding:20px; border-radius:8px; text-align:center;">
        <h2 style="color:#333;">Verify Your Email</h2>
        <p>Your OTP code is:</p>
        <a 
          style="
            display:inline-block;
            padding:12px 24px;
            background:#4CAF50;
            color:#fff;
            text-decoration:none;
            font-size:18px;
            border-radius:6px;
            margin:10px 0;
          "
        >
          ${OTP}
        </a>
        <p style="font-size:12px;color:#777;">This code will expire in 5 minutes.</p>
      </div>
    </div>
        `,
    });

    const OTPObj = {
      email: email,
      otp: OTP,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    };

    await otpModel.create(OTPObj);

    const resData = {
      email,
    };

    res.status(200).json({
      message: "OTP sends successFully",
      status: true,
      data: resData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: false,
      data: null,
    });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(email)

    if (!email) {
      return res.status(400).json({
        message: "Required fields are missing",
        status: false,
        data: null,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email does not exists",
        status: false,
        data: null,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: email },
      process.env.PRIVATE_KEY,
      { expiresIn: "15m" }
    );

    const FE_URL = `http://${process.env.FE_URL}?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: "465",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: `Your forget password link`,

    text: `Your link is ${FE_URL}`,



    });

    res.status(200).json({
      message: "Link send On your Email For change Password",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: false,
      data: null,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    console.log(password, confirmPassword);
    console.log(token);

    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        message: "Required fields are missing",
        data: null,
        status: false,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ // 400 ya 422 behtar hai bad request ke liye
        message: "Password and confirm password must be the same",
        data: null,
        status: false,
      });
    }

    // JWT verify error throw karta hai agar token invalid/expired ho
    let verifyToken;
    try {
      verifyToken = jwt.verify(token, process.env.PRIVATE_KEY); // Agar koi aur secret key hai toh wo dein
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired reset token",
        data: null,
        status: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await userModel.findByIdAndUpdate(verifyToken.id, {
      password: hashPassword,
    });

    return res.status(200).json({
      message: "Your password has changed successfully",
      status: true,
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: false,
      data: null,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user.id;
    
    
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// export const checkReq = (req, res) => {

//   const parser = new UAParser(req.headers['user-agent'])

//   console.log(parser.getResult())

//   console.log("userAgent",req.headers['user-agent']);
//   res.send("Hit success")
// }
