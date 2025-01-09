import express from "express";
import { createProduct, deleteProduct, editProduct, getAllProducts, getAllProductsCount } from "../controllers/product.js"
import { authenticateToken } from "../controllers/auth.js";

const productRouter = express.Router();

productRouter.post('/create-product', authenticateToken, createProduct);

productRouter.get('/get-all-products', authenticateToken, getAllProducts);

productRouter.delete('/delete-product/:_id', authenticateToken, deleteProduct);

productRouter.put('/edit-product/:_id', authenticateToken, editProduct);

productRouter.get('/get-all-products-count', authenticateToken, getAllProductsCount);

export default productRouter;