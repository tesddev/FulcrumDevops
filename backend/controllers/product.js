import jwt from "jsonwebtoken";
import { apiResponseCode } from "../helper.js";
import Product from "../models/Product.js";

const createProduct = async (req, res) => {
    try {
        // Extract the Bearer token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                responseCode: apiResponseCode.UNAUTHORIZED_ACCESS,
                responseMessage: "Access denied, no token provided"
            });
        }

        // Decode the token to extract the product's ID
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Create a new product instance using the request body
        const newProduct = new Product({
            ...req.body,
            createdBy: decoded.id
        });

        // Save the product to the database
        await newProduct.save();

        // Respond with success
        res.status(201).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "Product successfully created",
            data: newProduct,
        });
    } catch (error) {
        // Handle errors and respond with a 500 Internal Server Error
        res.status(500).json({
            responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
            responseMessage: "Product creation error",
            data: null,
            error: error.message,
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        // Retrieve all products from the database
        const products = await Product.find();

        res.status(200).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "Product list retrieved successfully",
            data: {
                totalproducts: products.length,
                products: products // Returns the list of all products
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

const editProduct = async (req, res) => {
    try {
        const { _id } = req.params;
        const { productName, productDescription, productPrice, productCategory } = req.body;

        // Find the product by ID
        const product = await Product.findById(_id);
        if (!product) {
            return res.status(404).json({
                responseCode: apiResponseCode.MISSING_DETAILS,
                responseMessage: "Product not found"
            });
        }

        // Update the fields that are provided in the request body
        if (productName) product.productName = productName;
        if (productDescription) product.productDescription = productDescription;
        if (productPrice) product.productPrice = productPrice;
        if (productCategory) product.productCategory = productCategory;

        // Save the updated product to the database
        await product.save();

        res.status(200).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "Product updated successfully",
            data: {
                productName: product.productName,
                productDescription: product.productDescription,
                productPrice: product.productPrice,
                productCategory: product.productCategory
            }
        });
    } catch (error) {
        res.status(500).json({
            responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
            responseMessage: "Internal Server Error",
            error: error.message
        });
    }
};

const deleteProduct = async(req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params._id);
        if (!product) {
            return res.status(404).json({
                responseCode: apiResponseCode.MISSING_DETAILS,
                responseMessage: "product not found"
            });
        }

        res.status(200).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "product deleted successfully",
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

const getAllProductsCount = async(req, res) => {
    try {
        // Count the total number of users in the database
        const productsCount = await Product.countDocuments();

        res.status(200).json({
            responseCode: apiResponseCode.SUCCESSFUL,
            responseMessage: "Number of products retrieved successfully",
            data: {
                totalProducts: productsCount
            }
        });
    } catch (error) {
        res.status(500).json({
            responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
            responseMessage: "Internal Server Error",
            error: error.message
        });
    }
};

export { createProduct, getAllProducts, editProduct, deleteProduct, getAllProductsCount };
