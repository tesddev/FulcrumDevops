import Joi from "joi";
import { apiResponseCode } from "../helper.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            responseCode: apiResponseCode.UNAUTHORIZED_ACCESS,
            responseMessage: "Access denied, admin privileges required"
        });
    }
    next();
};

const deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params._id);
        if (!user) {
            return res.status(404).json({
                responseCode: apiResponseCode.MISSING_DETAILS,
                responseMessage: "User not found"
            });
        }

        res.status(200).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "User deleted successfully",
            data: null
        });
    } catch (error) {
        res.status(500).json({
            responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
            responseMessage: "Internal Server Error",
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
            // Retrieve all users from the database
        const users = await User.find();

        res.status(200).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "Users list retrieved successfully",
            data: {
                totalUsers: users.length,
                users: users // Returns the list of all users
            }
        });
    } catch (error) {
        res.status(500).json({
            responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
            responseMessage: "Internal Server Error",
            error: error.message
        });
    }
}

const createUser = async (req, res) => {
    const registerSchema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().optional(),
    });

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                responseCode: apiResponseCode.UNAUTHORIZED_ACCESS,
                responseMessage: "Access denied, admin privileges required"
            });
        }

        // validate user/client request
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                responseCode: apiResponseCode.BAD_REQUEST,
                responseMessage: error.details[0].message,
                data: null,
            });
        }

        const { fullName, email, phoneNumber, username, password, role } = req.body;

        // Check if all required fields are provided
        if (!fullName || !email || !phoneNumber || !username || !password ) {
            return res.status(400).json({
                responseCode: apiResponseCode.BAD_REQUEST,
                responseMessage: "All fields are required"
            });
        }

        // Check if user with the email sent from the client already exists in the database
        let userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json({
                responseCode: apiResponseCode.BAD_REQUEST,
                responseMessage: `${email} already exist`,
                data: null,
            });
        }

        // Check if user with the username sent from the client already exists in the database
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({
                responseCode: apiResponseCode.BAD_REQUEST,
                responseMessage: `${username} already exist`,
                data: null,
            });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            username,
            password: hashedPassword,
            role: role || 'user' 
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "User created successfully",
            data: {
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
            responseMessage: "Internal Server Error",
            error: error.message
        });
    }
}

const editUser = async (req, res) => {
    try {
        const { _id } = req.params;
        const { fullName, email, phoneNumber, username, password } = req.body;

        // Find the user by ID
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({
                responseCode: apiResponseCode.MISSING_DETAILS,
                responseMessage: "User not found"
            });
        }

        // Update the fields that are provided in the request body
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (username) user.username = username;
        if (password) {
            const hashedPassword =  await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        // Save the updated user to the database
        await user.save();

        res.status(200).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "User profile updated successfully",
            data: {
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        res.status(500).json({
            responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
            responseMessage: "Internal Server Error",
            error: error.message
        });
    }
}

export { deleteUser, isAdmin, getAllUsers, createUser, editUser };
