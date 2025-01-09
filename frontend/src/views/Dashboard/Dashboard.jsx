import { Layout, Menu, Card } from "antd";
import { SettingOutlined, DashboardOutlined, UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Pie } from "@ant-design/plots";
import { Link } from "react-router-dom";
import useDashboard from "../../customHooks/useDashboard";

const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const { userCount, productCount, loading } = useDashboard();
  const userName = sessionStorage.getItem("userName") || "User";

  const data = [
    {
      type: "Users",
      value: userCount,
    },
    {
      type: "Products",
      value: productCount,
    },
  ];

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    label: {
      type: "spider",
      labelHeight: 28,
      content: ({ name, value }) =>
        `${name}: ${value} (${(value / (userCount + productCount) * 100).toFixed(2)}%)`,
    },
    interactions: [{ type: "element-active" }],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="logo" style={{ color: "#fff", textAlign: "center", padding: "20px 0" }}>
          Dashboard
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
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
          <h1 className="font-bold text-2xl">Welcome, {userName}</h1>
        </Header>

        <Content style={{ margin: "16px" }}>
          <Card className="max-w-[30rem] w-[90%] mx-auto">
            <h2 className="text-center">Total Users: {userCount}</h2>
            <h2 className="text-center">Total Products: {productCount}</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Pie {...config} />
            )}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button>
                <Link to="/products">Go to Products</Link>
              </button>
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
