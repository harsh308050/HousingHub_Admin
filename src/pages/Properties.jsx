import { useState } from 'react'
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal } from 'react-bootstrap'
import { Search, Filter, Eye, CheckCircle, XCircle, MapPin, DollarSign, Home } from 'lucide-react'
import './Properties.css'

const Properties = () => {
    const [showModal, setShowModal] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState(null)

    const properties = [
        { id: 1, name: 'Sunset Villa PG', owner: 'Rajesh Kumar', type: 'PG', city: 'Mumbai', area: 'Andheri', price: '₹8,500/month', rooms: 12, status: 'approved', featured: true },
        { id: 2, name: 'Cozy 2BHK Apartment', owner: 'Priya Sharma', type: 'Flat', city: 'Delhi', area: 'Dwarka', price: '₹15,000/month', rooms: 1, status: 'pending', featured: false },
        { id: 3, name: 'Student Hostel', owner: 'Amit Patel', type: 'PG', city: 'Bangalore', area: 'Koramangala', price: '₹7,000/month', rooms: 20, status: 'approved', featured: true },
        { id: 4, name: 'Luxury Villa', owner: 'Sneha Reddy', type: 'House', city: 'Hyderabad', area: 'Banjara Hills', price: '₹45,000/month', rooms: 1, status: 'approved', featured: false },
        { id: 5, name: 'Single Room for Girls', owner: 'Vikram Singh', type: 'Room', city: 'Pune', area: 'Hinjewadi', price: '₹6,500/month', rooms: 8, status: 'rejected', featured: false }
    ]

    const stats = [
        { label: 'Total Properties', value: '3,892', icon: Home, color: '#3b82f6' },
        { label: 'Approved', value: '3,245', icon: CheckCircle, color: '#10b981' },
        { label: 'Pending Approval', value: '412', icon: Filter, color: '#f59e0b' },
        { label: 'Featured', value: '156', icon: DollarSign, color: '#8b5cf6' }
    ]

    const getStatusBadge = (status) => {
        const variants = {
            approved: { bg: 'success', text: 'Approved' },
            pending: { bg: 'warning', text: 'Pending' },
            rejected: { bg: 'danger', text: 'Rejected' }
        }
        const variant = variants[status]
        return <Badge bg={variant.bg}>{variant.text}</Badge>
    }

    const handleViewProperty = (property) => {
        setSelectedProperty(property)
        setShowModal(true)
    }

    return (
        <Container fluid className="properties-container">
            <div className="page-header fade-in">
                <div>
                    <h2 className="page-title">Property Management</h2>
                    <p className="page-subtitle">Manage all listed properties across the platform</p>
                </div>
                <Button className="btn-primary">
                    + Add Property
                </Button>
            </div>

            <Row className="g-4 mb-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Col key={index} xs={12} sm={6} lg={3}>
                            <Card className="glass-card stat-mini-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <Card.Body>
                                    <div className="stat-content">
                                        <div>
                                            <p className="stat-mini-label">{stat.label}</p>
                                            <h3 className="stat-mini-value" style={{ color: stat.color }}>{stat.value}</h3>
                                        </div>
                                        <Icon size={32} style={{ color: stat.color, opacity: 0.3 }} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
            </Row>

            <Card className="glass-card fade-in">
                <Card.Body>
                    <div className="table-controls">
                        <div className="search-box">
                            <Search size={18} />
                            <Form.Control type="text" placeholder="Search properties..." className="search-input" />
                        </div>
                        <div className="filter-actions">
                            <Form.Select className="filter-select">
                                <option>All Cities</option>
                                <option>Mumbai</option>
                                <option>Delhi</option>
                                <option>Bangalore</option>
                            </Form.Select>
                            <Form.Select className="filter-select">
                                <option>All Types</option>
                                <option>PG</option>
                                <option>Flat</option>
                                <option>Room</option>
                                <option>House</option>
                            </Form.Select>
                            <Button variant="outline-primary" className="filter-btn">
                                <Filter size={18} />
                                More Filters
                            </Button>
                        </div>
                    </div>

                    <Table responsive hover className="custom-table">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Owner</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Price</th>
                                <th>Rooms</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map((property) => (
                                <tr key={property.id}>
                                    <td>
                                        <div className="property-cell">
                                            <div className="property-image">🏠</div>
                                            <div>
                                                <div className="property-name">{property.name}</div>
                                                {property.featured && <Badge bg="warning" className="featured-badge">⭐ Featured</Badge>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{property.owner}</td>
                                    <td><Badge bg="info">{property.type}</Badge></td>
                                    <td>
                                        <div className="location-cell">
                                            <MapPin size={14} />
                                            {property.area}, {property.city}
                                        </div>
                                    </td>
                                    <td className="price-cell">{property.price}</td>
                                    <td>{property.rooms} {property.type === 'PG' ? 'Beds' : 'Unit'}</td>
                                    <td>{getStatusBadge(property.status)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <Button size="sm" variant="outline-primary" onClick={() => handleViewProperty(property)}>
                                                <Eye size={14} />
                                            </Button>
                                            {property.status === 'pending' && (
                                                <>
                                                    <Button size="sm" variant="outline-success">
                                                        <CheckCircle size={14} />
                                                    </Button>
                                                    <Button size="sm" variant="outline-danger">
                                                        <XCircle size={14} />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Property Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProperty && (
                        <div className="property-details">
                            <h5>{selectedProperty.name}</h5>
                            <Row className="mt-3">
                                <Col md={6}>
                                    <p><strong>Owner:</strong> {selectedProperty.owner}</p>
                                    <p><strong>Type:</strong> {selectedProperty.type}</p>
                                    <p><strong>Location:</strong> {selectedProperty.area}, {selectedProperty.city}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Price:</strong> {selectedProperty.price}</p>
                                    <p><strong>Rooms/Units:</strong> {selectedProperty.rooms}</p>
                                    <p><strong>Status:</strong> {getStatusBadge(selectedProperty.status)}</p>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary">Edit Property</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default Properties
