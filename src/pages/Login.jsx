import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import logo from '../assets/Logo.png'
import './Login.css'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        // Implement Firebase authentication here
        console.log('Login attempt:', credentials)
        // Temporary validation
        if (credentials.email && credentials.password) {
            window.location.href = '/dashboard'
        } else {
            setError('Please enter valid credentials')
        }
    }

    return (
        <div className="login-page">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={5} lg={4}>
                        <div className="login-card-wrapper fade-in">
                            <Card className="login-card glass-card">
                                <Card.Body className="p-5">
                                    <div className="text-center mb-4">
                                        <div className="login-logo">
                                            <img src={logo} alt="HousingHub Logo" className="logo-icon-large" />
                                        </div>
                                        <h2 className="login-title">HousingHub</h2>
                                        <p className="login-subtitle">Admin Panel</p>
                                    </div>

                                    {error && (
                                        <Alert variant="danger" className="glass-card">
                                            {error}
                                        </Alert>
                                    )}

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="form-label-custom">
                                                <Mail size={16} />
                                                Email Address
                                            </Form.Label>
                                            <div className="input-wrapper">
                                                <Form.Control
                                                    type="email"
                                                    placeholder="admin@housinghub.com"
                                                    value={credentials.email}
                                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                                    required
                                                    className="input-custom"
                                                />
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="form-label-custom">
                                                <Lock size={16} />
                                                Password
                                            </Form.Label>
                                            <div className="input-wrapper position-relative">
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    value={credentials.password}
                                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                                    required
                                                    className="input-custom"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Check
                                                type="checkbox"
                                                label="Remember me"
                                                className="custom-checkbox"
                                            />
                                        </Form.Group>

                                        <Button type="submit" className="btn-login w-100 mb-3">
                                            <LogIn size={18} />
                                            Sign In to Dashboard
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login
