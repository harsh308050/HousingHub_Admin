import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { Save, Database, Mail, Globe, Shield } from 'lucide-react'

const Settings = () => {
    const [settings, setSettings] = useState({
        siteName: 'HousingHub',
        supportEmail: 'support@housinghub.com',
        contactPhone: '+91 1234567890',
        maintenanceMode: false,
        allowRegistration: true
    })

    const [saved, setSaved] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        // Save settings to Firebase
        console.log('Saving settings:', settings)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const handleBackup = () => {
        // Implement backup functionality
        alert('Backup initiated! Data will be exported as JSON.')
    }

    return (
        <Container fluid>
            <div className="page-header fade-in">
                <div>
                    <h2 className="page-title">Settings</h2>
                    <p className="page-subtitle">Platform configuration and management</p>
                </div>
            </div>

            {saved && (
                <Alert variant="success" className="fade-in">
                    ✓ Settings saved successfully!
                </Alert>
            )}

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <div className="d-flex align-items-center gap-2">
                                <Globe size={20} style={{ color: 'var(--primary-blue)' }} />
                                <h5 className="chart-title mb-0">Platform Settings</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Site Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Support Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={settings.supportEmail}
                                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Phone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        value={settings.contactPhone}
                                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                        id="maintenance-mode"
                                        label="Enable Maintenance Mode"
                                        checked={settings.maintenanceMode}
                                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                    />
                                    <Form.Text className="text-muted">
                                        Platform will be unavailable to users during maintenance
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="switch"
                                        id="allow-registration"
                                        label="Allow New User Registration"
                                        checked={settings.allowRegistration}
                                        onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                                    />
                                </Form.Group>

                                <Button type="submit" className="btn-primary">
                                    <Save size={18} />
                                    Save Settings
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="glass-card fade-in mb-4">
                        <Card.Header className="chart-header">
                            <div className="d-flex align-items-center gap-2">
                                <Database size={20} style={{ color: 'var(--success-color)' }} />
                                <h5 className="chart-title mb-0">Data Management</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Export platform data as JSON backup
                            </p>
                            <Button variant="outline-success" className="w-100" onClick={handleBackup}>
                                <Database size={18} />
                                Export Backup
                            </Button>
                        </Card.Body>
                    </Card>

                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <div className="d-flex align-items-center gap-2">
                                <Shield size={20} style={{ color: 'var(--warning-color)' }} />
                                <h5 className="chart-title mb-0">Security</h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-2">
                                <Button variant="outline-primary">
                                    Change Password
                                </Button>
                                <Button variant="outline-warning">
                                    Two-Factor Auth
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Settings
