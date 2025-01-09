import Joi from "joi";
import { apiResponseCode } from "../helper.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";

const registration = async (req, res) => {
  const registerSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().optional(),
  });

  try {
    // validate user/client request
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: error.details[0].message,
        data: null,
      });
    }
    // destructure fields/values from the request body
    const { fullName, email, phoneNumber, username, password, role } = req.body;

    // Check if user with the email sent from the client already exist in the database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: `${email} already exist`,
        data: null,
      });
    }

    // Check if user with the username sent from the client already exists in the database
    let userName = await User.findOne({ username });
    if (userName) {
        return res.status(400).json({
            responseCode: apiResponseCode.BAD_REQUEST,
            responseMessage: `${userName} already exist`,
            data: null,
        });
    }

    // Hashing of password before saving to the database
    const hashPassword = await bcrypt.hash(password, 10);

    // create the information as a new user
    user = new User({
      fullName,
      email,
      phoneNumber,
      username,
      password: hashPassword,
      role: role || 'user' 
    });

    // save the user to the database
    await user.save();

    res.status(201).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: `${email} registered successfully`,
      data: {
        fullName,
        email,
        phoneNumber,
        username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

const login = async (req, res) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    // validate user/client request
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: error.details[0].message,
        data: null,
      });
    }

    // destructure fields/values from the request body
    const { email, password } = req.body;

    // find if the user email exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Invalid credentials",
        data: null,
      });
    }

    // check if password sent matches the password on how database
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "Invalid credentials",
        data: null,
      });
    }

    // create/sign a token that the  user can use to access protected routes and also make sure the token expires in one hour
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: `${email} login successfully`,
      data: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        username: user.username,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
      responseMessage: "Internal server error",
      data: null,
    });
  }
};

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
      return res.status(401).json({
          responseCode: apiResponseCode.AUTH_MISSING,
          responseMessage: "Authorization token is missing",
      });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
      if (err) {
          return res.status(403).json({
              responseCode: apiResponseCode.EXPIRED_TOKEN,
              responseMessage: "Invalid or expired token",
          });
      }
      req.user = user;
      next();
  });
}

export { registration, login, authenticateToken };
