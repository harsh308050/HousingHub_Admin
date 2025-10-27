import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Badge, Form, Button, Modal, Spinner } from 'react-bootstrap'
import { Calendar, CheckCircle, XCircle, Clock, Eye, Search, Download, FileText, User, Home, CreditCard } from 'lucide-react'
import { db } from '../config/firebase'
import { collection, getDocs } from 'firebase/firestore'

const Bookings = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const bookingsSnapshot = await getDocs(collection(db, 'Bookings'))
            const bookingsData = bookingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            // Sort by creation date (newest first)
            bookingsData.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0)
                const dateB = b.createdAt?.toDate?.() || new Date(0)
                return dateB - dateA
            })

            setBookings(bookingsData)
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A'
        const date = timestamp.toDate?.() || new Date(timestamp)
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    const formatPrice = (price) => {
        return `₹${price?.toLocaleString('en-IN') || 0}`
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Completed': { bg: 'success', icon: CheckCircle },
            'Pending': { bg: 'warning', icon: Clock },
            'Cancelled': { bg: 'danger', icon: XCircle },
            'Active': { bg: 'info', icon: CheckCircle }
        }
        const config = statusConfig[status] || { bg: 'secondary', icon: Clock }
        const Icon = config.icon
        return (
            <Badge bg={config.bg} className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                <Icon size={14} />
                {status}
            </Badge>
        )
    }

    const calculateStats = () => {
        const total = bookings.length
        const completed = bookings.filter(b => b.status === 'Completed').length
        const pending = bookings.filter(b => b.status === 'Pending').length
        const totalRevenue = bookings
            .filter(b => b.status === 'Completed')
            .reduce((sum, b) => sum + (b.paymentInfo?.amount || 0), 0)

        return { total, completed, pending, totalRevenue }
    }

    // Filter bookings
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = !searchTerm ||
            booking.tenantData?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.propertyData?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus

        return matchesSearch && matchesStatus
    })

    const handleViewBooking = (booking) => {
        setSelectedBooking(booking)
        setShowModal(true)
    }

    const stats = calculateStats()
    const statsDisplay = [
        { label: 'Total Bookings', value: stats.total.toLocaleString(), icon: Calendar, color: '#3b82f6' },
        { label: 'Completed', value: stats.completed.toLocaleString(), icon: CheckCircle, color: '#10b981' },
        { label: 'Pending', value: stats.pending.toLocaleString(), icon: Clock, color: '#f59e0b' },
        { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: CreditCard, color: '#8b5cf6' }
    ]

    if (loading) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3" style={{ color: 'var(--text-muted)' }}>Loading bookings...</p>
                </div>
            </Container>
        )
    }

    return (
        <Container fluid>
            <div className="page-header fade-in">
                <h2 className="page-title">Booking Management</h2>
                <p className="page-subtitle">Manage all property bookings and reservations</p>
            </div>

            {/* Stats Cards */}
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

            {/* Bookings Table */}
            <Card className="glass-card fade-in">
                <Card.Body>
                    <div className="table-controls">
                        <div className="search-box">
                            <Search size={18} />
                            <Form.Control
                                type="text"
                                placeholder="Search by tenant, owner, property, booking ID..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-actions">
                            <Form.Select
                                className="filter-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Active">Active</option>
                                <option value="Cancelled">Cancelled</option>
                            </Form.Select>
                        </div>
                    </div>

                    <Table responsive hover className="custom-table">
                        <thead>
                            <tr>
                                <th style={{ minWidth: '100px' }}>Booking ID</th>
                                <th style={{ minWidth: '150px' }}>Tenant</th>
                                <th style={{ minWidth: '150px' }}>Property</th>
                                <th style={{ minWidth: '150px' }}>Owner</th>
                                <th style={{ minWidth: '100px' }}>Check-In</th>
                                <th style={{ minWidth: '80px' }}>Duration</th>
                                <th style={{ minWidth: '100px' }}>Amount</th>
                                <th style={{ minWidth: '100px' }}>Status</th>
                                <th style={{ minWidth: '80px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">
                                        No bookings found
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>
                                            <code style={{ fontSize: '0.7rem', color: 'var(--primary-blue)' }}>
                                                {booking.bookingId?.substring(0, 8)}...
                                            </code>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.9rem' }}>{booking.tenantData?.fullName || 'N/A'}</div>
                                            <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                                                {booking.tenantData?.tenantEmail?.substring(0, 20)}...
                                            </small>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.9rem' }}>{booking.propertyData?.title || 'N/A'}</div>
                                            <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                                                {booking.propertyData?.roomType} • {booking.propertyData?.city}
                                            </small>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.9rem' }}>{booking.ownerName || 'N/A'}</div>
                                            <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                                                {booking.ownerEmail?.substring(0, 20)}...
                                            </small>
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>{formatDate(booking.checkInDate)}</td>
                                        <td>
                                            <Badge bg="info" style={{ fontSize: '0.75rem' }}>{booking.bookingPeriodMonths} Months</Badge>
                                        </td>
                                        <td>
                                            <strong style={{ color: 'var(--primary-blue)', fontSize: '0.9rem' }}>
                                                {formatPrice(booking.paymentInfo?.amount)}
                                            </strong>
                                        </td>
                                        <td>{getStatusBadge(booking.status)}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                onClick={() => handleViewBooking(booking)}
                                                style={{ padding: '4px 8px' }}
                                            >
                                                <Eye size={14} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Booking Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Booking Details</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {selectedBooking && (
                        <div>
                            {/* Booking Info */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <h6 style={{ color: 'var(--primary-blue)' }}>
                                        <FileText size={18} className="me-2" />
                                        Booking Information
                                    </h6>
                                    <p><strong>Booking ID:</strong> <code>{selectedBooking.bookingId}</code></p>
                                    <p><strong>Status:</strong> {getStatusBadge(selectedBooking.status)}</p>
                                    <p><strong>Created:</strong> {formatDate(selectedBooking.createdAt)}</p>
                                    <p><strong>Updated:</strong> {formatDate(selectedBooking.updatedAt)}</p>
                                    <p><strong>Check-In:</strong> {formatDate(selectedBooking.checkInDate)}</p>
                                    <p><strong>Check-Out:</strong> {formatDate(selectedBooking.checkoutDate)}</p>
                                    <p><strong>Duration:</strong> {selectedBooking.bookingPeriodMonths} months</p>
                                    {selectedBooking.notes && (
                                        <p><strong>Notes:</strong> {selectedBooking.notes}</p>
                                    )}
                                </Col>
                                <Col md={6}>
                                    <h6 style={{ color: 'var(--primary-blue)' }}>
                                        <CreditCard size={18} className="me-2" />
                                        Payment Information
                                    </h6>
                                    <p><strong>Amount:</strong> {formatPrice(selectedBooking.paymentInfo?.amount)}</p>
                                    <p><strong>Currency:</strong> {selectedBooking.paymentInfo?.currency || 'INR'}</p>
                                    <p><strong>Payment Method:</strong> {selectedBooking.paymentInfo?.paymentMethod}</p>
                                    <p><strong>Payment ID:</strong> <code>{selectedBooking.paymentInfo?.paymentId}</code></p>
                                    <p><strong>Payment Status:</strong>
                                        <Badge bg={selectedBooking.paymentInfo?.status === 'Completed' ? 'success' : 'warning'} className="ms-2">
                                            {selectedBooking.paymentInfo?.status}
                                        </Badge>
                                    </p>
                                    <p><strong>Completed At:</strong> {selectedBooking.paymentInfo?.paymentCompletedAt || 'N/A'}</p>
                                    {selectedBooking.receiptUrl && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            href={selectedBooking.receiptUrl}
                                            target="_blank"
                                            className="mt-2"
                                        >
                                            <Download size={14} className="me-2" />
                                            Download Receipt
                                        </Button>
                                    )}
                                </Col>
                            </Row>

                            {/* Tenant & Owner Info */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <h6 style={{ color: 'var(--primary-blue)' }}>
                                        <User size={18} className="me-2" />
                                        Tenant Information
                                    </h6>
                                    <p><strong>Name:</strong> {selectedBooking.tenantData?.fullName}</p>
                                    <p><strong>Email:</strong> {selectedBooking.tenantData?.tenantEmail}</p>
                                    <p><strong>Mobile:</strong> {selectedBooking.tenantData?.mobileNumber}</p>
                                    <p><strong>Gender:</strong> {selectedBooking.tenantData?.gender}</p>
                                </Col>
                                <Col md={6}>
                                    <h6 style={{ color: 'var(--primary-blue)' }}>
                                        <User size={18} className="me-2" />
                                        Owner Information
                                    </h6>
                                    <p><strong>Name:</strong> {selectedBooking.ownerName}</p>
                                    <p><strong>Email:</strong> {selectedBooking.ownerEmail}</p>
                                    <p><strong>Mobile:</strong> {selectedBooking.ownerMobileNumber}</p>
                                </Col>
                            </Row>

                            {/* Property Info */}
                            <Row className="mb-4">
                                <Col xs={12}>
                                    <h6 style={{ color: 'var(--primary-blue)' }}>
                                        <Home size={18} className="me-2" />
                                        Property Information
                                    </h6>
                                    {selectedBooking.propertyData?.images && selectedBooking.propertyData.images.length > 0 && (
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflowX: 'auto' }}>
                                            {selectedBooking.propertyData.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`Property ${idx + 1}`}
                                                    style={{
                                                        width: '150px',
                                                        height: '100px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        border: '2px solid var(--glass-border)'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Title:</strong> {selectedBooking.propertyData?.title}</p>
                                            <p><strong>Type:</strong> {selectedBooking.propertyData?.propertyType}</p>
                                            <p><strong>Room Type:</strong> {selectedBooking.propertyData?.roomType}</p>
                                            <p><strong>Address:</strong> {selectedBooking.propertyData?.address}</p>
                                            <p><strong>City:</strong> {selectedBooking.propertyData?.city}, {selectedBooking.propertyData?.state}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Rent:</strong> {formatPrice(selectedBooking.propertyData?.rent)}/month</p>
                                            <p><strong>Deposit:</strong> {formatPrice(selectedBooking.propertyData?.deposit)}</p>
                                            <p><strong>Male Allowed:</strong> {selectedBooking.propertyData?.maleAllowed ? 'Yes' : 'No'}</p>
                                            <p><strong>Female Allowed:</strong> {selectedBooking.propertyData?.femaleAllowed ? 'Yes' : 'No'}</p>
                                            <p><strong>Amenities:</strong>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                                    {selectedBooking.propertyData?.amenities?.map((amenity, idx) => (
                                                        <Badge key={idx} bg="secondary">{amenity}</Badge>
                                                    ))}
                                                </div>
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            {/* ID Proofs */}
                            {selectedBooking.idProof && Object.keys(selectedBooking.idProof).length > 0 && (
                                <Row>
                                    <Col xs={12}>
                                        <h6 style={{ color: 'var(--primary-blue)' }}>
                                            <FileText size={18} className="me-2" />
                                            Tenant ID Proofs
                                        </h6>
                                        <Row>
                                            {Object.entries(selectedBooking.idProof).map(([key, doc]) => (
                                                <Col key={key} xs={12} md={6} lg={3} className="mb-3">
                                                    <Card style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--glass-border)' }}>
                                                        <Card.Body>
                                                            <p style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                                                                <strong>{doc.documentName || key}</strong>
                                                            </p>
                                                            <img
                                                                src={doc.documentUrl}
                                                                alt={doc.documentName}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '120px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '6px',
                                                                    marginBottom: '8px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => window.open(doc.documentUrl, '_blank')}
                                                            />
                                                            <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                                                                {doc.documentType}
                                                            </small>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default Bookings
