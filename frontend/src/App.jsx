import { Route, Routes } from "react-router-dom";
import { App as AntApp } from "antd"; // Import Ant Design's App component
import Product from "./views/products/Product";
import ProductDetails from "./views/products/ProductDetails";
import Login from "./views/Login";
import Register from "./views/Register";
import Dashboard from "./views/Dashboard/Dashboard";
import Users from "./views/Users/Users";
import Settings from "./views/settings/Settings";

const App = () => {
  return (
    <AntApp>
      <Routes>
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </AntApp>
  );
};

export default App;
