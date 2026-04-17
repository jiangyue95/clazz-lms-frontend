import React from 'react'
import { Col, Flex, Layout, Menu } from 'antd';



const { Header, Footer, Sider, Content } = Layout;

const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
};

const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
};

const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#1677ff',
};

const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
};

const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(50% - 8px)',
    maxWidth: 'calc(50% - 8px)',
};

const titleStyle = {
    fontSize: '40px',
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'KaiTi, serif'
};


const App = () => (
    <Flex gap="middle" wrap>
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                <div style={titleStyle}>Clazz lms</div>
                <div style={{ marginLeft: 'auto', color: 'white' }}>
                    <a href='#' style={{ color: 'white', marginRight: '20px' }}>
                        修改密码
                    </a>
                    <a href='#'>退出登录</a>
                </div>
            </Header>
            <Layout>
                <Sider width="25%" style={siderStyle}>Sider</Sider>
                <Content style={contentStyle}>Content</Content>
            </Layout>
            <Footer style={footerStyle}>Footer</Footer>
        </Layout>
    </Flex >
);

export default App;