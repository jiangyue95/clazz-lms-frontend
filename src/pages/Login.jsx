import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../api/auth'

const Login = () => {
    const navigate = useNavigate()

    const onFinish = async (values) => {
        const res = await loginApi(values)
        if (res.data.code === 1) {
            localStorage.setItem('token', res.data.data.token)
            navigate('/')
        } else {
            message.error('Invalid username or password')
        }
    }
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Form
                name="login"
                style={{ width:360 }}
                onFinish={onFinish}
            >
                <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Clazz LMS</h2>
                <Form.Item name="username" rules={[{ required: true, message: 'Please enter usename' }]}>
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Please enter password'}]}>
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login