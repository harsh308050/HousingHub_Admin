import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/Logo.png'
import './Login.css'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Query the Admin collection for matching credentials
            const adminRef = collection(db, 'Admin')
            const q = query(
                adminRef,
                where('email', '==', credentials.email),
                where('password', '==', credentials.password)
            )

            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                // Admin credentials match
                const adminDoc = querySnapshot.docs[0]
                const adminData = adminDoc.data()

                // Store admin session in localStorage
                localStorage.setItem('isAuthenticated', 'true')
                localStorage.setItem('adminEmail', adminData.email)
                localStorage.setItem('adminId', adminDoc.id)

                // Update auth context
                login()

                // Navigate to dashboard
                navigate('/dashboard')
            } else {
                // No matching credentials
                setError('Invalid email or password. Please try again.')
            }
        } catch (error) {
            console.error('Login error:', error)
            setError('An error occurred during login. Please try again.')
        } finally {
            setLoading(false)
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
                                                    disabled={loading}
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
                                                    disabled={loading}
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    disabled={loading}
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
                                                disabled={loading}
                                            />
                                        </Form.Group>

                                        <Button type="submit" className="btn-login w-100 mb-3" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        className="me-2"
                                                    />
                                                    Signing in...
                                                </>
                                            ) : (
                                                <>
                                                    <LogIn size={18} />
                                                    Sign In to Dashboard
                                                </>
                                            )}
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
