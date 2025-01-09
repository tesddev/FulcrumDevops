import { apiResponseCode } from "../helper.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ 
                responseCode: apiResponseCode.BAD_REQUEST, 
                responseMessage: "New password is required" 
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

        res.status(200).json({ 
            responseCode: apiResponseCode.SUCCESSFUL, 
            responseMessage: "Password updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
            responseMessage: "Internal Server Error",
            error: error.message
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { username, fullName, email, phoneNumber } = req.body;

        // Check if any fields are provided for updating
        if (!username && !fullName && !email && !phoneNumber) {
            return res.status(400).json({
                responseCode: apiResponseCode.BAD_REQUEST,
                responseMessage: "At least one field is required to update"
            });
        }

        // Find the user by ID from the authenticated token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                responseCode: apiResponseCode.MISSING_DETAILS,
                responseMessage: "User not found"
            });
        }

        // Update the fields that are provided in the request body
        if (username) user.username = username;
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        // Save the updated user to the database
        await user.save();

        res.status(200).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "Profile updated successfully",
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

const getAllUsersCount = async (req, res) => {
    try {
        // Count the total number of users in the database
        const userCount = await User.countDocuments();

        res.status(200).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "Number of users retrieved successfully",
            data: {
                totalUsers: userCount
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

const getUserProfile = async (req, res) => {
    try {
            // Retrieve the user ID from the request parameters
        const { _id } = req.params;

        // Find the user by ID in the database
        const user = await User.findById(_id);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                responseCode: apiResponseCode.MISSING_DETAILS,
                responseMessage: "User not found"
            });
        }

        // Return the user's profile details
        res.status(200).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "User profile retrieved successfully",
            data: {
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
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

export { updatePassword, updateProfile, getAllUsersCount, getUserProfile };
