import { Layout, Menu, Form, Input, Button, message } from "antd";
import { SettingOutlined, DashboardOutlined, UserOutlined, AppstoreOutlined } from "@ant-design/icons"; // Import icons
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const Settings = () => {
  const navigate = useNavigate(); 
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [settings, setSettings] = useState({
    username: "admin",
    email: "admin@example.com",
  });

  const handleAccountUpdate = (values) => {
    setSettings({ ...settings, ...values });
    message.success("Account updated successfully!");
  };

  const handleChangePassword = (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Passwords do not match!");
    } else {
      message.success("Password changed successfully!");
      passwordForm.resetFields();
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="logo" style={{ color: "#fff", textAlign: "center", padding: "20px 0" }}>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
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
          <h1 className="font-bold text-2xl">
            <SettingOutlined style={{ marginRight: '10px' }} /> {/* Settings Icon in Header */}
            Settings
          </h1>
        </Header>

        <Content style={{ margin: "16px", padding: "24px", background: "#fff" }}>
          <div className="settings-form-container" style={{ maxWidth: "500px", margin: "0 auto" }}>
            <Form
              form={form}
              layout="vertical"
              initialValues={settings}
              onFinish={handleAccountUpdate}
            >
              <h2>Account Information</h2>

              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Please enter your username" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Account
                </Button>
              </Form.Item>
            </Form>

        
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <h2>Change Password</h2>

              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: "Please enter your current password" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[{ required: true, message: "Please enter a new password" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                rules={[{ required: true, message: "Please confirm your new password" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Change Password
                </Button>
              </Form.Item>

                <Button type="primary" htmlType="submit" onClick={handleLogout}>
                  Logout
                </Button>
            </Form>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Settings;
