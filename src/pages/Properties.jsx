import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal, Spinner } from 'react-bootstrap'
import { Search, Filter, Eye, CheckCircle, XCircle, MapPin, DollarSign, Home, Calendar, Users } from 'lucide-react'
import { getDocs, collectionGroup } from 'firebase/firestore'
import { db } from '../config/firebase'
import './Properties.css'

const Properties = () => {
    const [showModal, setShowModal] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState(null)
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterListing, setFilterListing] = useState('all')
    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        unavailable: 0,
        booked: 0
    })

    // Fetch all properties from nested structure
    const fetchProperties = async () => {
        try {
            setLoading(true)
            const allProperties = []

            // Get all Available properties using collectionGroup (without orderBy to avoid index requirement)
            const availableQuery = collectionGroup(db, 'Available')
            const availableSnapshot = await getDocs(availableQuery)
            availableSnapshot.forEach(doc => {
                allProperties.push({
                    id: doc.id,
                    ...doc.data(),
                    availability: 'available'
                })
            })

            // Get all Unavailable properties using collectionGroup
            const unavailableQuery = collectionGroup(db, 'Unavailable')
            const unavailableSnapshot = await getDocs(unavailableQuery)
            unavailableSnapshot.forEach(doc => {
                allProperties.push({
                    id: doc.id,
                    ...doc.data(),
                    availability: 'unavailable'
                })
            })

            // Sort in JavaScript instead of Firestore
            allProperties.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0)
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0)
                return dateB - dateA // Descending order (newest first)
            })

            setProperties(allProperties)

            // Calculate stats
            const available = allProperties.filter(p => p.isAvailable === true).length
            const unavailable = allProperties.filter(p => p.isAvailable === false).length
            const booked = allProperties.filter(p => p.currentBookingStatus === 'Approved').length

            setStats({
                total: allProperties.length,
                available,
                unavailable,
                booked
            })

            setLoading(false)
        } catch (error) {
            console.error('Error fetching properties:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProperties()
    }, [])

    const getStatusBadge = (isAvailable, currentBookingStatus) => {
        if (currentBookingStatus === 'Approved') {
            return <Badge bg="info">Booked</Badge>
        } else if (isAvailable) {
            return <Badge bg="success">Available</Badge>
        } else {
            return <Badge bg="danger">Unavailable</Badge>
        }
    }

    const handleViewProperty = (property) => {
        setSelectedProperty(property)
        setShowModal(true)
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A'
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const formatPrice = (price) => {
        return `₹${price?.toLocaleString('en-IN') || 0}`
    }

    // Get property price based on listing type
    const getPropertyPrice = (property) => {
        if (property.listingType === 'sale') {
            return { amount: property.salePrice || 0, type: 'Sale Price' }
        } else {
            return { amount: property.price || 0, type: 'Rent/Month' }
        }
    }

    // Fixed property types
    const propertyTypes = ['all', 'Apartment', 'House', 'Villa', 'PG/Hostel', 'Others']

    // Filter properties
    const filteredProperties = properties.filter(property => {
        const matchesSearch = !searchTerm ||
            property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.city?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = filterType === 'all' || property.propertyType === filterType
        const matchesListing = filterListing === 'all' || property.listingType === filterListing
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'available' && property.isAvailable) ||
            (filterStatus === 'unavailable' && !property.isAvailable) ||
            (filterStatus === 'booked' && property.currentBookingStatus === 'Approved')

        return matchesSearch && matchesType && matchesListing && matchesStatus
    })

    const statsDisplay = [
        { label: 'Total Properties', value: stats.total.toLocaleString(), icon: Home, color: '#3b82f6' },
        { label: 'Available', value: stats.available.toLocaleString(), icon: CheckCircle, color: '#10b981' },
        { label: 'Booked', value: stats.booked.toLocaleString(), icon: Calendar, color: '#f59e0b' },
        { label: 'Unavailable', value: stats.unavailable.toLocaleString(), icon: XCircle, color: '#ef4444' }
    ]

    if (loading) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3" style={{ color: 'var(--text-secondary)' }}>Loading properties...</p>
                </div>
            </Container>
        )
    }

    return (
        <Container fluid className="properties-container">
            <div className="page-header fade-in">
                <div>
                    <h2 className="page-title">Property Management</h2>
                    <p className="page-subtitle">Manage all listed properties across the platform</p>
                </div>
            </div>

            <Row className="g-4 mb-4">
                {statsDisplay.map((stat, index) => {
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
                            <Form.Control
                                type="text"
                                placeholder="Search properties..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-actions">
                            <Form.Select
                                className="filter-select"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                {propertyTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'all' ? 'All Types' : type}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Select
                                className="filter-select"
                                value={filterListing}
                                onChange={(e) => setFilterListing(e.target.value)}
                            >
                                <option value="all">All Listings</option>
                                <option value="rent">For Rent</option>
                                <option value="sale">For Sale</option>
                            </Form.Select>
                            <Form.Select
                                className="filter-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="available">Available</option>
                                <option value="booked">Booked</option>
                                <option value="unavailable">Unavailable</option>
                            </Form.Select>
                        </div>
                    </div>
                    <Table responsive hover className="custom-table">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Type</th>
                                <th>Listing</th>
                                <th>Location</th>
                                <th>Price</th>
                                <th>Details</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProperties.map((property) => {
                                const priceInfo = getPropertyPrice(property);
                                return (
                                    <tr key={property.id}>
                                        <td>
                                            <div className="property-cell">
                                                {property.images && property.images[0] ? (
                                                    <img
                                                        src={property.images[0]}
                                                        alt={property.title}
                                                        className="property-image"
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px' }}
                                                    />
                                                ) : (
                                                    <div className="property-image">🏠</div>
                                                )}
                                                <div>
                                                    <div className="property-name">{property.title || 'Untitled Property'}</div>
                                                    <small style={{ color: 'var(--text-muted)' }}>{property.roomType}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><Badge bg="info">{property.propertyType || 'N/A'}</Badge></td>
                                        <td>
                                            <Badge bg={property.listingType === 'sale' ? 'success' : 'primary'}>
                                                {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="location-cell">
                                                <MapPin size={14} />
                                                {property.city}, {property.state}
                                            </div>
                                            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                {property.pincode}
                                            </small>
                                        </td>
                                        <td className="price-cell">
                                            <div><strong>{formatPrice(priceInfo.amount)}</strong></div>
                                            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                {priceInfo.type}
                                            </small>
                                            {property.listingType !== 'sale' && property.securityDeposit > 0 && (
                                                <div>
                                                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                        Deposit: {formatPrice(property.securityDeposit)}
                                                    </small>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                <div>{property.bedrooms}BR • {property.bathrooms}BA</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                    {property.squareFootage} sq.ft
                                                </div>
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(property.isAvailable, property.currentBookingStatus)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <Button size="sm" variant="outline-primary" onClick={() => handleViewProperty(property)}>
                                                    <Eye size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    {filteredProperties.length === 0 && (
                        <div className="text-center py-5">
                            <p style={{ color: 'var(--text-muted)' }}>No properties found</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProperty?.title || 'Property Details'}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {selectedProperty && (
                        <div className="property-details">
                            {/* Property Images */}
                            {selectedProperty.images && selectedProperty.images.length > 0 && (
                                <Row className="mb-4">
                                    <Col xs={12}>
                                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                                            {selectedProperty.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`Property ${idx + 1}`}
                                                    style={{
                                                        width: '200px',
                                                        height: '150px',
                                                        objectFit: 'cover',
                                                        borderRadius: '10px',
                                                        border: '2px solid var(--glass-border)'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            {/* Property Info */}
                            <Row className="mb-3">
                                <Col md={6}>
                                    <h6 style={{ color: 'var(--primary-blue)' }}>Basic Information</h6>
                                    <p><strong>Type:</strong> {selectedProperty.propertyType}</p>
                                    <p><strong>Room Type:</strong> {selectedProperty.roomType}</p>
                                    <p><strong>Listing Type:</strong>
                                        <Badge bg={selectedProperty.listingType === 'sale' ? 'success' : 'primary'} className="ms-2">
                                            {selectedProperty.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                                        </Badge>
                                    </p>
                                    <p><strong>Address:</strong> {selectedProperty.address}</p>
                                    <p><strong>Pincode:</strong> {selectedProperty.pincode}</p>
                                    <p><strong>Furnishing:</strong> {selectedProperty.furnishingStatus}</p>
                                </Col>
                                <Col md={6}>
                                    <h6 style={{ color: 'var(--primary-blue)' }}>Pricing & Details</h6>
                                    {selectedProperty.listingType === 'sale' ? (
                                        <>
                                            <p><strong>Sale Price:</strong> {formatPrice(selectedProperty.salePrice || 0)}</p>
                                            <p><strong>Ownership Type:</strong> {selectedProperty.ownershipType || 'N/A'}</p>
                                            <p><strong>Property Age:</strong> {selectedProperty.propertyAge ? `${selectedProperty.propertyAge} years` : 'N/A'}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p><strong>Monthly Rent:</strong> {formatPrice(selectedProperty.price || 0)}</p>
                                            <p><strong>Security Deposit:</strong> {formatPrice(selectedProperty.securityDeposit || 0)}</p>
                                            <p><strong>Minimum Booking:</strong> {selectedProperty.minimumBookingPeriod || 'N/A'}</p>
                                        </>
                                    )}
                                    <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                                    <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                                    <p><strong>Square Footage:</strong> {selectedProperty.squareFootage} sq.ft</p>
                                    {selectedProperty.listingType !== 'sale' && selectedProperty.currentTenant && (
                                        <div>
                                            <h6 style={{ color: 'var(--primary-blue)' }} className="mt-3">Current Tenant</h6>
                                            <p><strong>Name:</strong> {selectedProperty.currentTenant.fullName}</p>
                                            <p><strong>Email:</strong> {selectedProperty.currentTenant.tenantEmail}</p>
                                            <p><strong>Phone:</strong> {selectedProperty.currentTenant.mobileNumber}</p>
                                        </div>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <h6 style={{ color: 'var(--primary-blue)' }}>Additional Details</h6>
                                    <p><strong>Gender Allowed:</strong>
                                        {selectedProperty.maleAllowed && selectedProperty.femaleAllowed ? ' Both' :
                                            selectedProperty.maleAllowed ? ' Male Only' :
                                                selectedProperty.femaleAllowed ? ' Female Only' : ' Not Specified'}
                                    </p>
                                    <p><strong>Owner Email:</strong> {selectedProperty.ownerEmail}</p>
                                    {selectedProperty.video && (
                                        <p><strong>Video Available:</strong> Yes</p>
                                    )}
                                </Col>
                                <Col md={6}>
                                    <h6 style={{ color: 'var(--primary-blue)' }}>Amenities</h6>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {selectedProperty.amenities?.map((amenity, idx) => (
                                            <Badge key={idx} bg="secondary">{amenity}</Badge>
                                        ))}
                                    </div>
                                </Col>
                            </Row>

                            {selectedProperty.description && (
                                <Row className="mb-3">
                                    <Col xs={12}>
                                        <h6 style={{ color: 'var(--primary-blue)' }}>Description</h6>
                                        <p style={{ color: 'var(--text-muted)' }}>{selectedProperty.description}</p>
                                    </Col>
                                </Row>
                            )}

                            {selectedProperty.description && (
                                <Row className="mb-3">
                                    <Col xs={12}>
                                        <h6 style={{ color: 'var(--primary-blue)' }}>Description</h6>
                                        <p style={{
                                            color: 'var(--text-secondary)',
                                            maxHeight: '150px',
                                            overflowY: 'auto',
                                            padding: '10px',
                                            background: 'rgba(15, 23, 42, 0.3)',
                                            borderRadius: '8px'
                                        }}>
                                            {selectedProperty.description}
                                        </p>
                                    </Col>
                                </Row>
                            )}

                            {selectedProperty.currentBookingStatus === 'Approved' && (
                                <Row>
                                    <Col xs={12}>
                                        <div style={{
                                            background: 'rgba(37, 99, 235, 0.1)',
                                            padding: '15px',
                                            borderRadius: '10px',
                                            border: '1px solid var(--primary-blue)'
                                        }}>
                                            <h6 style={{ color: 'var(--primary-blue)' }}>
                                                <Calendar size={18} className="me-2" />
                                                Current Booking
                                            </h6>
                                            <Row>
                                                <Col md={6}>
                                                    <p><strong>Check-in:</strong> {formatDate(selectedProperty.checkInDate)}</p>
                                                    <p><strong>Check-out:</strong> {formatDate(selectedProperty.checkoutDate)}</p>
                                                </Col>
                                                <Col md={6}>
                                                    <p><strong>Booking Period:</strong> {selectedProperty.bookingPeriodMonths} months</p>
                                                    <p><strong>Booking ID:</strong> {selectedProperty.currentBookingId}</p>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default Properties
