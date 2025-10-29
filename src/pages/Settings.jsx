import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap'
import { Save, User, Lock, Mail, AlertTriangle, Eye, EyeOff, Key } from 'lucide-react'
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import './Settings.css'

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
    const [apiKeysData, setApiKeysData] = useState({
        cloudinaryCloudName: '',
        cloudinaryUploadPreset: '',
        countryStateCityAPI: '',
        razorpayKey: ''
    })
    const [showApiKeys, setShowApiKeys] = useState({
        cloudinaryCloudName: false,
        cloudinaryUploadPreset: false,
        countryStateCityAPI: false,
        razorpayKey: false
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

            // Fetch API Keys from AppControl/ApiKeys
            const apiKeysDoc = await getDoc(doc(db, 'AppControl', 'ApiKeys'))
            if (apiKeysDoc.exists()) {
                const data = apiKeysDoc.data()
                setApiKeysData({
                    cloudinaryCloudName: data.cloudinaryCloudName || '',
                    cloudinaryUploadPreset: data.cloudinaryUploadPreset || '',
                    countryStateCityAPI: data.countryStateCityAPI || '',
                    razorpayKey: data.razorpayKey || ''
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

    const handleUpdateApiKeys = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const apiKeysRef = doc(db, 'AppControl', 'ApiKeys')
            const updateData = {
                cloudinaryCloudName: apiKeysData.cloudinaryCloudName,
                cloudinaryUploadPreset: apiKeysData.cloudinaryUploadPreset,
                countryStateCityAPI: apiKeysData.countryStateCityAPI,
                razorpayKey: apiKeysData.razorpayKey
            }

            // Check if document exists
            const docSnap = await getDoc(apiKeysRef)

            if (docSnap.exists()) {
                await updateDoc(apiKeysRef, updateData)
            } else {
                await setDoc(apiKeysRef, updateData)
            }

            showAlert('success', 'API Keys updated successfully!')
        } catch (error) {
            console.error('Error updating API keys:', error)
            showAlert('error', 'Failed to update API keys')
        } finally {
            setSaving(false)
        }
    }

    const toggleApiKeyVisibility = (keyName) => {
        setShowApiKeys(prev => ({
            ...prev,
            [keyName]: !prev[keyName]
        }))
    }

    if (loading) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        )
    }

    return (
        <Container fluid className="settings-container">
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
                    <Card className="settings-card fade-in">
                        <Card.Header>
                            <div className="d-flex align-items-center">
                                <div className="settings-section-icon">
                                    <User size={20} style={{ color: '#60a5fa' }} />
                                </div>
                                <h5 className="settings-section-title">Admin Profile</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleUpdateEmail}>
                                <Form.Group className="settings-form-group">
                                    <Form.Label className="settings-form-label">
                                        <Mail size={16} />
                                        Email Address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        className="settings-form-control"
                                        value={adminData.email}
                                        onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="settings-form-group">
                                    <Form.Label className="settings-form-label">
                                        <Lock size={16} />
                                        Current Password
                                    </Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            className="settings-form-control"
                                            value={adminData.password}
                                            disabled
                                            style={{ paddingRight: '45px' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="password-toggle-btn"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </Form.Group>

                                <div className="settings-btn-group">
                                    <Button type="submit" className="settings-btn-primary" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <Spinner size="sm" />
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
                                        className="settings-btn-secondary"
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
                    <Card className="settings-card fade-in">
                        <Card.Header>
                            <div className="d-flex align-items-center gap-2">
                                <div className="settings-section-icon">
                                    <AlertTriangle size={20} style={{ color: '#fbbf24' }} />
                                </div>
                                <h5 className="settings-section-title">Maintenance Mode</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="maintenance-switch">
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Check
                                        type="switch"
                                        id="maintenance-mode"
                                        checked={maintenanceData.UnderMaintenance}
                                        onChange={(e) => handleMaintenanceToggle(e.target.checked)}
                                        disabled={saving}
                                    />
                                    <h5 className="settings-section-title">
                                        {maintenanceData.UnderMaintenance ? ' Maintenance Mode: ON' : ' Maintenance Mode: OFF'}
                                    </h5>
                                </div>
                                <Form.Text>
                                    When enabled, the platform will be unavailable to users
                                </Form.Text>
                            </div>

                            {maintenanceData.updatedBy && (
                                <div className="settings-info-box">
                                    <div className="settings-info-label">
                                        Last Updated By:
                                    </div>
                                    <div className="settings-info-value">
                                        {maintenanceData.updatedBy}
                                    </div>
                                    {maintenanceData.updatedAt && (
                                        <div className="settings-info-timestamp">
                                            {new Date(maintenanceData.updatedAt?.seconds * 1000).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            )}

                            {maintenanceData.UnderMaintenance && (
                                <div className="settings-warning-alert">
                                    <AlertTriangle size={18} />
                                    The platform is currently under maintenance
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* API Keys Section */}
            <Row className="g-4 mt-2">
                <Col lg={12}>
                    <Card className="settings-card fade-in">
                        <Card.Header>
                            <div className="d-flex align-items-center">
                                <div className="settings-section-icon">
                                    <Key size={20} style={{ color: '#10b981' }} />
                                </div>
                                <h5 className="settings-section-title">API Keys Management</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleUpdateApiKeys}>
                                <Row>
                                    {/* Cloudinary Cloud Name */}
                                    <Col md={6}>
                                        <Form.Group className="settings-form-group api-key-field">
                                            <Form.Label className="settings-form-label">
                                                <Key size={16} />
                                                Cloudinary Cloud Name
                                            </Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type={showApiKeys.cloudinaryCloudName ? "text" : "password"}
                                                    className="settings-form-control"
                                                    placeholder="Enter Cloudinary Cloud Name"
                                                    value={apiKeysData.cloudinaryCloudName}
                                                    onChange={(e) => setApiKeysData({ ...apiKeysData, cloudinaryCloudName: e.target.value })}
                                                    style={{ paddingRight: '45px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleApiKeyVisibility('cloudinaryCloudName')}
                                                    className="password-toggle-btn"
                                                >
                                                    {showApiKeys.cloudinaryCloudName ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </Form.Group>
                                    </Col>

                                    {/* Cloudinary Upload Preset */}
                                    <Col md={6}>
                                        <Form.Group className="settings-form-group api-key-field">
                                            <Form.Label className="settings-form-label">
                                                <Key size={16} />
                                                Cloudinary Upload Preset
                                            </Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type={showApiKeys.cloudinaryUploadPreset ? "text" : "password"}
                                                    className="settings-form-control"
                                                    placeholder="Enter Cloudinary Upload Preset"
                                                    value={apiKeysData.cloudinaryUploadPreset}
                                                    onChange={(e) => setApiKeysData({ ...apiKeysData, cloudinaryUploadPreset: e.target.value })}
                                                    style={{ paddingRight: '45px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleApiKeyVisibility('cloudinaryUploadPreset')}
                                                    className="password-toggle-btn"
                                                >
                                                    {showApiKeys.cloudinaryUploadPreset ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </Form.Group>
                                    </Col>

                                    {/* Country State City API */}
                                    <Col md={6}>
                                        <Form.Group className="settings-form-group api-key-field">
                                            <Form.Label className="settings-form-label">
                                                <Key size={16} />
                                                Country State City API Key
                                            </Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type={showApiKeys.countryStateCityAPI ? "text" : "password"}
                                                    className="settings-form-control"
                                                    placeholder="Enter Country State City API Key"
                                                    value={apiKeysData.countryStateCityAPI}
                                                    onChange={(e) => setApiKeysData({ ...apiKeysData, countryStateCityAPI: e.target.value })}
                                                    style={{ paddingRight: '45px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleApiKeyVisibility('countryStateCityAPI')}
                                                    className="password-toggle-btn"
                                                >
                                                    {showApiKeys.countryStateCityAPI ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </Form.Group>
                                    </Col>

                                    {/* Razorpay Key */}
                                    <Col md={6}>
                                        <Form.Group className="settings-form-group api-key-field">
                                            <Form.Label className="settings-form-label">
                                                <Key size={16} />
                                                Razorpay API Key
                                            </Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type={showApiKeys.razorpayKey ? "text" : "password"}
                                                    className="settings-form-control"
                                                    placeholder="Enter Razorpay API Key"
                                                    value={apiKeysData.razorpayKey}
                                                    onChange={(e) => setApiKeysData({ ...apiKeysData, razorpayKey: e.target.value })}
                                                    style={{ paddingRight: '45px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleApiKeyVisibility('razorpayKey')}
                                                    className="password-toggle-btn"
                                                >
                                                    {showApiKeys.razorpayKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="settings-info-box" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div style={{ color: '#60a5fa', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <AlertTriangle size={16} />
                                        <strong>Security Notice:</strong>
                                    </div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                        These API keys are sensitive. Only update them if you have the correct credentials.
                                        Click the eye icon to view/hide the keys.
                                    </div>
                                </div>

                                <div className="settings-btn-group">
                                    <Button type="submit" className="settings-btn-primary" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <Spinner size="sm" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Update API Keys
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Change Password Modal */}
            <Modal
                show={showChangePassword}
                onHide={() => setShowChangePassword(false)}
                centered
                className="settings-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Lock size={20} className="me-2" />
                        Change Password
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleChangePassword}>
                        <Form.Group className="settings-form-group">
                            <Form.Label className="settings-form-label">Current Password</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showCurrentPassword ? "text" : "password"}
                                    className="settings-form-control"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    required
                                    style={{ paddingRight: '45px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="password-toggle-btn"
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </Form.Group>

                        <Form.Group className="settings-form-group">
                            <Form.Label className="settings-form-label">New Password</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showNewPassword ? "text" : "password"}
                                    className="settings-form-control"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    required
                                    minLength={6}
                                    style={{ paddingRight: '45px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="password-toggle-btn"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <Form.Text style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                Must be at least 6 characters long
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="settings-form-group">
                            <Form.Label className="settings-form-label">Confirm New Password</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="settings-form-control"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    required
                                    style={{ paddingRight: '45px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="password-toggle-btn"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </Form.Group>

                        <div className="d-flex gap-2 justify-content-end">
                            <Button
                                variant="secondary"
                                onClick={() => setShowChangePassword(false)}
                                style={{
                                    background: 'rgba(51, 65, 85, 0.8)',
                                    border: '1px solid rgba(148, 163, 184, 0.3)',
                                    color: '#cbd5e1'
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="settings-btn-primary" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Spinner size="sm" />
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
