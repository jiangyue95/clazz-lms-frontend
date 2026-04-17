import { Layout, Menu } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = Layout

const menuItems = [
    { key: '/', label: 'Home' },
    {
        key: 'clazz',
        label: "Class & Student Management",
        children: [
            { key: '/class', label: 'Class Management' },
            { key: '/student', label: 'Student Management' },
        ],
    },
    {
        key: 'system',
        label: "System Management",
        children: [
            { key: '/department', label: 'Department Management' },
            { key: '/employee', label: 'Employee Management' },
        ],
    },
    {
        key: 'stats',
        label: "Statistics",
        children: [
            { key: '/stats/employee', label: 'Employee Statistics' },
            { key: '/stats/student', label: 'Student Statistics' },
            { key: '/stats/log', label: 'Log Statistics' },
        ],
    },
]

const AppLayout = () => {
    const navigate = useNavigate()

    const handleMenuClick = ({ key }) => {
        navigate(key)
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                    Clazz LMS
                </span>
                <span>
                    <a style={{ color: "white", marginRight: "20px" }}>Change Password</a>
                    <a style={{ color: "white" }}>Logout</a>
                </span>
            </Header>
            <Layout>
                <Sider width={220}>
                    <Menu
                        theme='dark'
                        mode='inline'
                        items={menuItems}
                        onClick={handleMenuClick}
                    />
                </Sider>
                <Content style={{ padding: '24px' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default AppLayout