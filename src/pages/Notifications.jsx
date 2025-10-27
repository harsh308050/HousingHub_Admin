import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { Bell, Send } from 'lucide-react'

const Notifications = () => {
    const [notification, setNotification] = useState({
        title: '',
        message: '',
        type: 'all'
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Sending notification:', notification)
        // Implement notification sending logic
        alert('Notification sent successfully!')
    }

    return (
        <Container fluid>
            <div className="page-header fade-in">
                <div>
                    <h2 className="page-title">Notifications & Announcements</h2>
                    <p className="page-subtitle">Send notifications to owners and tenants</p>
                </div>
            </div>

            <Row>
                <Col lg={8}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <h5 className="chart-title">Create New Announcement</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter notification title"
                                        value={notification.title}
                                        onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Message</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder="Enter your message here..."
                                        value={notification.message}
                                        onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Send To</Form.Label>
                                    <Form.Select
                                        value={notification.type}
                                        onChange={(e) => setNotification({ ...notification, type: e.target.value })}
                                    >
                                        <option value="all">All Users</option>
                                        <option value="owners">Property Owners Only</option>
                                        <option value="tenants">Tenants Only</option>
                                    </Form.Select>
                                </Form.Group>

                                <Button type="submit" className="btn-primary">
                                    <Send size={18} />
                                    Send Notification
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <h5 className="chart-title">Recent Notifications</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <Bell size={20} style={{ color: '#3b82f6' }} />
                                    <div className="activity-content">
                                        <p className="activity-text">New property guidelines</p>
                                        <small className="activity-time">2 hours ago</small>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <Bell size={20} style={{ color: '#10b981' }} />
                                    <div className="activity-content">
                                        <p className="activity-text">Payment reminder sent</p>
                                        <small className="activity-time">1 day ago</small>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <Bell size={20} style={{ color: '#f59e0b' }} />
                                    <div className="activity-content">
                                        <p className="activity-text">Platform maintenance</p>
                                        <small className="activity-time">3 days ago</small>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Notifications
