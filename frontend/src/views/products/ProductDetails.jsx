import { useParams } from "react-router-dom";
import products from "../../models/ProductsData";
import "./styling/productDetails.css"

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((prod) => prod.id === parseInt(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="bg">
      <div className="container">
        <div className="carAndName">
          <div className="float">
            <div className="product-info-section">
              <div className="product-header">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price ? `$${product.price}` : "Price not available"}</p>
              </div>
            </div>
            <div className="product-description">
              <h3 className="description-title">Product Description</h3>
              <p>{product.description}</p>
            </div>
          </div>
          <div className="product-actions">
            <button className="action-button edit-button">✎</button>
            <button className="action-button delete-button">🗑</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
