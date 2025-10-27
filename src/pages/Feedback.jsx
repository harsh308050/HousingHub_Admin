import { Container, Row, Col, Card, Table, Badge, Button, Form } from 'react-bootstrap'
import { MessageSquare, AlertCircle, CheckCircle } from 'lucide-react'

const Feedback = () => {
    const complaints = [
        { id: 1, user: 'Arjun Mehta', type: 'Tenant', subject: 'Property not as described', priority: 'high', status: 'pending', date: '2024-06-20' },
        { id: 2, user: 'Priya Sharma', type: 'Owner', subject: 'Payment issue', priority: 'medium', status: 'in-progress', date: '2024-06-22' },
        { id: 3, user: 'Karan Joshi', type: 'Tenant', subject: 'Maintenance request', priority: 'low', status: 'resolved', date: '2024-06-25' },
        { id: 4, user: 'Sneha Reddy', type: 'Owner', subject: 'Fake listing reported', priority: 'high', status: 'pending', date: '2024-06-27' },
        { id: 5, user: 'Rahul Verma', type: 'Tenant', subject: 'Security deposit refund', priority: 'medium', status: 'resolved', date: '2024-06-28' }
    ]

    const stats = [
        { label: 'Total Complaints', value: '234', color: '#3b82f6' },
        { label: 'Pending', value: '45', color: '#f59e0b' },
        { label: 'In Progress', value: '28', color: '#0ea5e9' },
        { label: 'Resolved', value: '161', color: '#10b981' }
    ]

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            'in-progress': 'info',
            resolved: 'success'
        }
        return <Badge bg={variants[status]}>{status.toUpperCase()}</Badge>
    }

    const getPriorityBadge = (priority) => {
        const variants = {
            high: 'danger',
            medium: 'warning',
            low: 'secondary'
        }
        return <Badge bg={variants[priority]}>{priority.toUpperCase()}</Badge>
    }

    return (
        <Container fluid>
            <div className="page-header fade-in">
                <h2 className="page-title">Feedback & Complaints</h2>
                <p className="page-subtitle">Manage user feedback and complaints</p>
            </div>

            <Row className="g-4 mb-4">
                {stats.map((stat, index) => (
                    <Col key={index} xs={12} sm={6} lg={3}>
                        <Card className="glass-card stat-mini-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <Card.Body>
                                <p className="stat-mini-label">{stat.label}</p>
                                <h3 className="stat-mini-value" style={{ color: stat.color }}>{stat.value}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="glass-card fade-in">
                <Card.Body>
                    <div className="table-controls mb-3">
                        <Form.Select className="filter-select" style={{ maxWidth: '200px' }}>
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                        </Form.Select>
                    </div>

                    <Table responsive hover className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Type</th>
                                <th>Subject</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((complaint) => (
                                <tr key={complaint.id}>
                                    <td>#{complaint.id}</td>
                                    <td>{complaint.user}</td>
                                    <td><Badge bg="info">{complaint.type}</Badge></td>
                                    <td>{complaint.subject}</td>
                                    <td>{getPriorityBadge(complaint.priority)}</td>
                                    <td>{getStatusBadge(complaint.status)}</td>
                                    <td>{complaint.date}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <Button size="sm" variant="outline-primary">View</Button>
                                            {complaint.status !== 'resolved' && (
                                                <Button size="sm" variant="outline-success">Resolve</Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Feedback
