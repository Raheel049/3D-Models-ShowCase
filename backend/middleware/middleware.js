import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    console.log(req.cookies,"token from get api")

    if (!token) {

      console.log("not valid user")

      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}; 