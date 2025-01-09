import { Layout, Menu, Table, Button, Form, Input, Modal, Select, message } from "antd";
import { SettingOutlined, DashboardOutlined, UserOutlined, AppstoreOutlined } from "@ant-design/icons"; // Importing icons
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGetAllUsers from "../../customHooks/useGetAllUsers";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  
  const { users: fetchedUsers, fetchUsers } = useGetAllUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers]);

  const showModal = (user = null) => {
    setCurrentUser(user);
    form.setFieldsValue(user || { username: "", email: "", role: "" });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
    message.success("User deleted successfully!");
  };

  const handleSave = (values) => {
    if (currentUser) {
      // Editing existing user
      setUsers(
        users.map((user) =>
          user.id === currentUser.id ? { ...user, ...values } : user
        )
      );
      message.success("User updated successfully!");
    } else {
      // Adding new user
      const newUser = { ...values, id: users.length + 1 };
      setUsers([...users, newUser]);
      message.success("User added successfully!");
    }
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button type="link" style={{ marginRight: "1rem" }} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="logo" style={{ color: "#fff", textAlign: "center", padding: "20px 0" }}></div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["3"]}>
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
            <UserOutlined style={{ marginRight: "10px" }} /> Users
          </h1>
        </Header>

        <Content style={{ margin: "16px", padding: "24px", background: "#fff" }}>
          <div className="users-content">
            <Button type="primary" onClick={() => showModal(null)} style={{ marginBottom: "20px" }}>
              Add User
            </Button>

            <Table dataSource={users} columns={columns} rowKey="id" />

            <Modal
              title={currentUser ? "Edit User" : "Add User"}
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <Form form={form} layout="vertical" onFinish={handleSave}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true, message: "Please enter the username" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: "Please enter the email" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: "Please select the role" }]}
                >
                  <Select>
                    <Option value="Admin">Admin</Option>
                    <Option value="User">User</Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {currentUser ? "Update User" : "Add User"}
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UsersPage;
