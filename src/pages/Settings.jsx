import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap'
import { Save, User, Lock, Mail, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

const Settings = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [adminData, setAdminData] = useState({
        email: '',
        password: ''
    })
    const [maintenanceData, setMaintenanceData] = useState({
        UnderMaintenance: false,
        updatedBy: '',
        updatedAt: null
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [alert, setAlert] = useState({ show: false, type: '', message: '' })

    const adminId = localStorage.getItem('adminId')
    const adminEmail = localStorage.getItem('adminEmail')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // Fetch Admin data
            const adminDoc = await getDoc(doc(db, 'Admin', adminId))
            if (adminDoc.exists()) {
                setAdminData(adminDoc.data())
            }

            // Fetch Maintenance data from AppControl/Application
            const appControlDoc = await getDoc(doc(db, 'AppControl', 'Application'))
            if (appControlDoc.exists()) {
                const data = appControlDoc.data()
                setMaintenanceData({
                    UnderMaintenance: data.UnderMaintenance || false,
                    updatedBy: data.updatedBy || '',
                    updatedAt: data.updatedAt || null
                })
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            showAlert('error', 'Failed to load settings')
        } finally {
            setLoading(false)
        }
    }

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message })
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000)
    }

    const handleUpdateEmail = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const adminRef = doc(db, 'Admin', adminId)
            await updateDoc(adminRef, {
                email: adminData.email
            })

            // Update localStorage
            localStorage.setItem('adminEmail', adminData.email)

            showAlert('success', 'Email updated successfully!')
        } catch (error) {
            console.error('Error updating email:', error)
            showAlert('error', 'Failed to update email')
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()

        // Validate current password
        if (passwordForm.currentPassword !== adminData.password) {
            showAlert('error', 'Current password is incorrect')
            return
        }

        // Validate new password match
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showAlert('error', 'New passwords do not match')
            return
        }

        // Validate password length
        if (passwordForm.newPassword.length < 6) {
            showAlert('error', 'Password must be at least 6 characters long')
            return
        }

        setSaving(true)

        try {
            const adminRef = doc(db, 'Admin', adminId)
            await updateDoc(adminRef, {
                password: passwordForm.newPassword
            })

            // Update local state
            setAdminData({ ...adminData, password: passwordForm.newPassword })

            // Reset form and close modal
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setShowChangePassword(false)

            showAlert('success', 'Password changed successfully!')
        } catch (error) {
            console.error('Error changing password:', error)
            showAlert('error', 'Failed to change password')
        } finally {
            setSaving(false)
        }
    }

    const handleMaintenanceToggle = async (checked) => {
        setSaving(true)

        try {
            const appControlRef = doc(db, 'AppControl', 'Application')
            const updateData = {
                UnderMaintenance: checked,
                updatedBy: adminEmail,
                updatedAt: serverTimestamp()
            }

            // Check if document exists
            const docSnap = await getDoc(appControlRef)

            if (docSnap.exists()) {
                await updateDoc(appControlRef, updateData)
            } else {
                await setDoc(appControlRef, updateData)
            }

            setMaintenanceData(updateData)

            showAlert('success', `Maintenance mode ${checked ? 'enabled' : 'disabled'} successfully!`)
        } catch (error) {
            console.error('Error updating maintenance mode:', error)
            showAlert('error', 'Failed to update maintenance mode')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        )
    }

    return (
        <Container fluid>
            <div className="page-header fade-in">
                <div>
                    <h2 className="page-title">Settings</h2>
                    <p className="page-subtitle">Manage your profile and system settings</p>
                </div>
            </div>

            {alert.show && (
                <Alert variant={alert.type === 'success' ? 'success' : 'danger'} className="fade-in">
                    {alert.message}
                </Alert>
            )}

            <Row className="g-4">
                {/* Profile Settings */}
                <Col lg={6}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <div className="d-flex align-items-center gap-2">
                                <User size={20} style={{ color: 'var(--primary-blue)' }} />
                                <h5 className="chart-title mb-0">Admin Profile</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleUpdateEmail}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <Mail size={16} className="me-2" />
                                        Email Address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={adminData.email}
                                        onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        <Lock size={16} className="me-2" />
                                        Current Password
                                    </Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            value={adminData.password}
                                            disabled
                                            style={{ paddingRight: '40px' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                color: '#94a3b8',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button type="submit" className="btn-primary" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <Spinner size="sm" className="me-2" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Update Email
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline-warning"
                                        onClick={() => setShowChangePassword(true)}
                                    >
                                        <Lock size={18} />
                                        Change Password
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Maintenance Mode */}
                <Col lg={6}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <div className="d-flex align-items-center gap-2">
                                <AlertTriangle size={20} style={{ color: 'var(--warning-color)' }} />
                                <h5 className="chart-title mb-0">Maintenance Mode</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="switch"
                                    id="maintenance-mode"
                                    label={
                                        <span style={{ fontSize: '1.1rem', fontWeight: '500', color: '#e2e8f0' }}>
                                            {maintenanceData.UnderMaintenance ? 'Maintenance Mode: ON' : 'Maintenance Mode: OFF'}
                                        </span>
                                    }
                                    checked={maintenanceData.UnderMaintenance}
                                    onChange={(e) => handleMaintenanceToggle(e.target.checked)}
                                    disabled={saving}
                                    style={{ fontSize: '1.2rem' }}
                                />
                                <Form.Text style={{ color: '#94a3b8', display: 'block', marginTop: '0.5rem' }}>
                                    When enabled, the platform will be unavailable to users
                                </Form.Text>
                            </Form.Group>

                            {maintenanceData.updatedBy && (
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    background: 'rgba(37, 99, 235, 0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(37, 99, 235, 0.2)'
                                }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                        Last Updated By:
                                    </div>
                                    <div style={{ color: '#e2e8f0', fontWeight: '500' }}>
                                        {maintenanceData.updatedBy}
                                    </div>
                                    {maintenanceData.updatedAt && (
                                        <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                            {new Date(maintenanceData.updatedAt?.seconds * 1000).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            )}

                            {maintenanceData.UnderMaintenance && (
                                <Alert variant="warning" className="mt-3" style={{
                                    background: 'rgba(234, 179, 8, 0.1)',
                                    border: '1px solid rgba(234, 179, 8, 0.3)',
                                    color: '#fbbf24'
                                }}>
                                    <AlertTriangle size={16} className="me-2" />
                                    The platform is currently under maintenance
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Change Password Modal */}
            <Modal
                show={showChangePassword}
                onHide={() => setShowChangePassword(false)}
                centered
            >
                <Modal.Header style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                    color: '#e2e8f0'
                }}>
                    <Modal.Title>Change Password</Modal.Title>
                    <Button
                        variant="link"
                        onClick={() => setShowChangePassword(false)}
                        style={{ color: '#94a3b8' }}
                    >
                        ×
                    </Button>
                </Modal.Header>
                <Modal.Body style={{ background: 'rgba(15, 23, 42, 0.95)', color: '#e2e8f0' }}>
                    <Form onSubmit={handleChangePassword}>
                        <Form.Group className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    required
                                    style={{ paddingRight: '40px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    required
                                    minLength={6}
                                    style={{ paddingRight: '40px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <Form.Text style={{ color: '#94a3b8' }}>
                                Must be at least 6 characters long
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Confirm New Password</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    required
                                    style={{ paddingRight: '40px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </Form.Group>

                        <div className="d-flex gap-2 justify-content-end">
                            <Button
                                variant="secondary"
                                onClick={() => setShowChangePassword(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="btn-primary" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Spinner size="sm" className="me-2" />
                                        Changing...
                                    </>
                                ) : (
                                    'Change Password'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default Settings
