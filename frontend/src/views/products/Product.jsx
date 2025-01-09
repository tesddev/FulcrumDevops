import "./styling/product.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import { DashboardOutlined, AppstoreOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import products from "../../models/ProductsData";

const { Header, Content, Sider } = Layout;

const Product = () => {
  const [prods, setProds] = useState(products);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProd = () => {
    const id = prods.length + 1;
    const addProd = { ...newProduct, id };
    setProds([...prods, addProd]);
    setNewProduct({
      name: "",
      price: "",
      description: "",
      category: "",
    });
  };

  const formStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "25px",
    padding: "20px",
    alignItems: "center",
    maxWidth: "100%",
  };

  const inputStyle = {
    width: "90%",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "whitesmoke",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="logo" style={{ color: "#fff", textAlign: "center", padding: "20px 0" }}>
          Product Page
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["2"]}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />}>
            <Link to="/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>
            <Link to="/settings">Settings</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: "#fff", textAlign: "center" }}>
          <h1 className="font-bold text-2xl">Manage Your Products</h1>
        </Header>

        <Content style={{ margin: "16px", padding: "24px", background: "#fff" }}>
          <div className="add-product-form">
            <div className="add-new">
              <h2>Add New Product</h2>
            </div>
            <div className="product-input" style={formStyle}>
              <input
                style={inputStyle}
                type="text"
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleInput}
              />
              <input
                style={inputStyle}
                type="number"
                name="price"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleInput}
              />
              <input
                style={inputStyle}
                type="text"
                name="description"
                placeholder="Description"
                value={newProduct.description}
                onChange={handleInput}
              />
              <select
                style={inputStyle}
                name="category"
                value={newProduct.category}
                onChange={handleInput}
              >
                <option value="">Select Category</option>
                <option value="Sports">Sports</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Disco">Disco</option>
                <option value="Indoor">Indoor</option>
                <option value="Others">Others</option>
              </select>
              <Button
                type="primary"
                style={{ width: "90%" }}
                onClick={handleProd}
              >
                Add Product
              </Button>
            </div>
          </div>

          <div className="product-page">
            <div className="page-header">
              <h1>Products</h1>
            </div>

            <table className="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {prods.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Link to={`/products/${product.id}`}>{product.name}</Link>
                    </td>
                    <td>${product.price}</td>
                    <td>{product.description}</td>
                    <td>{product.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Product;
