import { useState } from 'react'
import { Container, Row, Col, Card, Table, Button, Badge, Form, Tab, Tabs, Modal } from 'react-bootstrap'
import { Search, Filter, Eye, CheckCircle, XCircle, Ban, Trash2, FileText } from 'lucide-react'
import './UserManagement.css'

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('owners')
    const [showModal, setShowModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const owners = [
        { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 98765 43210', city: 'Mumbai', listings: 5, verified: true, status: 'active', joinedDate: '2024-01-15' },
        { id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43211', city: 'Delhi', listings: 3, verified: false, status: 'pending', joinedDate: '2024-02-20' },
        { id: 3, name: 'Amit Patel', email: 'amit@example.com', phone: '+91 98765 43212', city: 'Bangalore', listings: 8, verified: true, status: 'active', joinedDate: '2024-03-10' },
        { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 98765 43213', city: 'Hyderabad', listings: 2, verified: true, status: 'active', joinedDate: '2024-04-05' },
        { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43214', city: 'Pune', listings: 6, verified: false, status: 'suspended', joinedDate: '2024-05-12' }
    ]

    const tenants = [
        { id: 1, name: 'Arjun Mehta', email: 'arjun@example.com', phone: '+91 98765 54321', city: 'Mumbai', bookings: 2, totalPayment: '₹45,000', status: 'active', joinedDate: '2024-01-20' },
        { id: 2, name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 98765 54322', city: 'Delhi', bookings: 1, totalPayment: '₹22,000', status: 'active', joinedDate: '2024-02-15' },
        { id: 3, name: 'Karan Joshi', email: 'karan@example.com', phone: '+91 98765 54323', city: 'Bangalore', bookings: 3, totalPayment: '₹67,000', status: 'active', joinedDate: '2024-03-08' },
        { id: 4, name: 'Pooja Nair', email: 'pooja@example.com', phone: '+91 98765 54324', city: 'Chennai', bookings: 1, totalPayment: '₹18,000', status: 'inactive', joinedDate: '2024-04-12' },
        { id: 5, name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91 98765 54325', city: 'Pune', bookings: 4, totalPayment: '₹89,000', status: 'active', joinedDate: '2024-05-01' }
    ]

    const handleViewDetails = (user) => {
        setSelectedUser(user)
        setShowModal(true)
    }

    const getStatusBadge = (status) => {
        const variants = {
            active: { bg: 'success', text: 'Active' },
            pending: { bg: 'warning', text: 'Pending' },
            suspended: { bg: 'danger', text: 'Suspended' },
            inactive: { bg: 'secondary', text: 'Inactive' }
        }
        const variant = variants[status] || variants.active
        return <Badge bg={variant.bg}>{variant.text}</Badge>
    }

    const stats = [
        { label: 'Total Owners', value: '1,245', color: '#3b82f6' },
        { label: 'Verified Owners', value: '987', color: '#10b981' },
        { label: 'Total Tenants', value: '8,567', color: '#f59e0b' },
        { label: 'Active Tenants', value: '7,234', color: '#8b5cf6' }
    ]

    return (
        <Container fluid className="user-management-container">
            <div className="page-header fade-in">
                <div>
                    <h2 className="page-title">User Management</h2>
                    <p className="page-subtitle">Manage owners and tenants across the platform</p>
                </div>
            </div>

            {/* Stats Row */}
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

            {/* Main Content */}
            <Card className="glass-card fade-in">
                <Card.Body>
                    {/* Search and Filters */}
                    <div className="table-controls">
                        <div className="search-box">
                            <Search size={18} />
                            <Form.Control
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className="filter-actions">
                            <Button variant="outline-primary" className="filter-btn">
                                <Filter size={18} />
                                Filters
                            </Button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="custom-tabs mb-4"
                    >
                        <Tab eventKey="owners" title="Property Owners">
                            <Table responsive hover className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Owner</th>
                                        <th>Contact</th>
                                        <th>City</th>
                                        <th>Listings</th>
                                        <th>Verified</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {owners.map((owner) => (
                                        <tr key={owner.id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">{owner.name.charAt(0)}</div>
                                                    <div>
                                                        <div className="user-name">{owner.name}</div>
                                                        <div className="user-email">{owner.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{owner.phone}</td>
                                            <td>{owner.city}</td>
                                            <td><Badge bg="info">{owner.listings} Properties</Badge></td>
                                            <td>
                                                {owner.verified ? (
                                                    <Badge bg="success"><CheckCircle size={14} /> Verified</Badge>
                                                ) : (
                                                    <Badge bg="warning">Pending</Badge>
                                                )}
                                            </td>
                                            <td>{getStatusBadge(owner.status)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        onClick={() => handleViewDetails(owner)}
                                                    >
                                                        <Eye size={14} />
                                                    </Button>
                                                    {!owner.verified && (
                                                        <Button size="sm" variant="outline-success">
                                                            <CheckCircle size={14} />
                                                        </Button>
                                                    )}
                                                    <Button size="sm" variant="outline-danger">
                                                        <Ban size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab eventKey="tenants" title="Tenants">
                            <Table responsive hover className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Tenant</th>
                                        <th>Contact</th>
                                        <th>City</th>
                                        <th>Bookings</th>
                                        <th>Total Payment</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenants.map((tenant) => (
                                        <tr key={tenant.id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">{tenant.name.charAt(0)}</div>
                                                    <div>
                                                        <div className="user-name">{tenant.name}</div>
                                                        <div className="user-email">{tenant.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{tenant.phone}</td>
                                            <td>{tenant.city}</td>
                                            <td><Badge bg="info">{tenant.bookings} Bookings</Badge></td>
                                            <td className="amount-cell">{tenant.totalPayment}</td>
                                            <td>{getStatusBadge(tenant.status)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        onClick={() => handleViewDetails(tenant)}
                                                    >
                                                        <Eye size={14} />
                                                    </Button>
                                                    <Button size="sm" variant="outline-danger">
                                                        <Ban size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>

            {/* User Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div className="user-details">
                            <Row>
                                <Col md={6}>
                                    <p><strong>Name:</strong> {selectedUser.name}</p>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    <p><strong>Phone:</strong> {selectedUser.phone}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>City:</strong> {selectedUser.city}</p>
                                    <p><strong>Status:</strong> {getStatusBadge(selectedUser.status)}</p>
                                    <p><strong>Joined:</strong> {selectedUser.joinedDate}</p>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary">
                        View Full Profile
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default UserManagement
