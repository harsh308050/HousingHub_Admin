import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Badge, Form, Tab, Tabs, Modal, Spinner } from 'react-bootstrap'
import { Search, Filter, Eye, CheckCircle, XCircle, Ban, Trash2, FileText } from 'lucide-react'
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import './UserManagement.css'

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('owners')
    const [showModal, setShowModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [owners, setOwners] = useState([])
    const [tenants, setTenants] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalOwners: 0,
        approvedOwners: 0,
        totalTenants: 0,
        activeTenants: 0
    })

    // Fetch Owners from Firestore
    const fetchOwners = async () => {
        try {
            const ownersQuery = query(collection(db, 'Owners'), orderBy('createdAt', 'desc'))
            const querySnapshot = await getDocs(ownersQuery)
            const ownersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setOwners(ownersData)

            // Calculate stats
            const approvedCount = ownersData.filter(o => o.approvalStatus === 'approved').length
            setStats(prev => ({
                ...prev,
                totalOwners: ownersData.length,
                approvedOwners: approvedCount
            }))
        } catch (error) {
            console.error('Error fetching owners:', error)
        }
    }

    // Fetch Tenants from Firestore
    const fetchTenants = async () => {
        try {
            const tenantsQuery = query(collection(db, 'Tenants'), orderBy('createdAt', 'desc'))
            const querySnapshot = await getDocs(tenantsQuery)
            const tenantsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setTenants(tenantsData)

            // For now, all tenants are considered active (you can add status field later)
            setStats(prev => ({
                ...prev,
                totalTenants: tenantsData.length,
                activeTenants: tenantsData.length
            }))
        } catch (error) {
            console.error('Error fetching tenants:', error)
        }
    }

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            await Promise.all([fetchOwners(), fetchTenants()])
            setLoading(false)
        }
        loadData()
    }, [])

    const handleViewDetails = (user) => {
        setSelectedUser(user)
        setShowModal(true)
    }

    const handleApproveOwner = async (ownerId) => {
        try {
            const ownerRef = doc(db, 'Owners', ownerId)
            await updateDoc(ownerRef, {
                approvalStatus: 'approved',
                approvalUpdatedAt: new Date()
            })
            // Refresh data
            await fetchOwners()
            alert('Owner approved successfully!')
        } catch (error) {
            console.error('Error approving owner:', error)
            alert('Failed to approve owner')
        }
    }

    const handleRejectOwner = async (ownerId) => {
        try {
            const ownerRef = doc(db, 'Owners', ownerId)
            await updateDoc(ownerRef, {
                approvalStatus: 'rejected',
                approvalUpdatedAt: new Date()
            })
            // Refresh data
            await fetchOwners()
            alert('Owner rejected')
        } catch (error) {
            console.error('Error rejecting owner:', error)
            alert('Failed to reject owner')
        }
    }

    const getStatusBadge = (status) => {
        const variants = {
            approved: { bg: 'success', text: 'Approved' },
            pending: { bg: 'warning', text: 'Pending' },
            rejected: { bg: 'danger', text: 'Rejected' },
            suspended: { bg: 'secondary', text: 'Suspended' }
        }
        const variant = variants[status] || variants.pending
        return <Badge bg={variant.bg}>{variant.text}</Badge>
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A'
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    // Filter function
    const filterUsers = (users, userType) => {
        if (!searchTerm) return users
        return users.filter(user => {
            const searchLower = searchTerm.toLowerCase()
            if (userType === 'owner') {
                return (
                    user.fullName?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    user.city?.toLowerCase().includes(searchLower) ||
                    user.mobileNumber?.includes(searchTerm)
                )
            } else {
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()
                return (
                    fullName.includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    user.mobileNumber?.includes(searchTerm)
                )
            }
        })
    }

    const statsDisplay = [
        { label: 'Total Owners', value: stats.totalOwners.toLocaleString(), color: '#3b82f6' },
        { label: 'Approved Owners', value: stats.approvedOwners.toLocaleString(), color: '#10b981' },
        { label: 'Total Tenants', value: stats.totalTenants.toLocaleString(), color: '#f59e0b' },
        { label: 'Active Tenants', value: stats.activeTenants.toLocaleString(), color: '#8b5cf6' }
    ]

    if (loading) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3" style={{ color: 'var(--text-secondary)' }}>Loading users...</p>
                </div>
            </Container>
        )
    }

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
                {statsDisplay.map((stat, index) => (
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
                                        <th>Location</th>
                                        <th>Approval Status</th>
                                        <th>ID Proof</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filterUsers(owners, 'owner').map((owner) => (
                                        <tr key={owner.id}>
                                            <td>
                                                <div className="user-cell">
                                                    {owner.profilePicture ? (
                                                        <img
                                                            src={owner.profilePicture}
                                                            alt={owner.fullName}
                                                            className="user-avatar"
                                                            style={{ borderRadius: '50%', width: '40px', height: '40px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div className="user-avatar">{owner.fullName?.charAt(0) || 'O'}</div>
                                                    )}
                                                    <div>
                                                        <div className="user-name">{owner.fullName || 'N/A'}</div>
                                                        <div className="user-email">{owner.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{owner.mobileNumber || 'N/A'}</td>
                                            <td>
                                                <div>
                                                    <div>{owner.city || 'N/A'}</div>
                                                    <small style={{ color: 'var(--text-muted)' }}>{owner.state || ''}</small>
                                                </div>
                                            </td>
                                            <td>{getStatusBadge(owner.approvalStatus || 'pending')}</td>
                                            <td>
                                                {owner.idProof?.type ? (
                                                    <Badge bg="info">{owner.idProof.type}</Badge>
                                                ) : (
                                                    <Badge bg="secondary">Not Uploaded</Badge>
                                                )}
                                            </td>
                                            <td>{formatDate(owner.createdAt)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        onClick={() => handleViewDetails(owner)}
                                                        title="View Details"
                                                    >
                                                        <Eye size={14} />
                                                    </Button>
                                                    {owner.approvalStatus === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline-success"
                                                                onClick={() => handleApproveOwner(owner.id)}
                                                                title="Approve"
                                                            >
                                                                <CheckCircle size={14} />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                onClick={() => handleRejectOwner(owner.id)}
                                                                title="Reject"
                                                            >
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
                            {filterUsers(owners, 'owner').length === 0 && (
                                <div className="text-center py-5">
                                    <p style={{ color: 'var(--text-muted)' }}>No owners found</p>
                                </div>
                            )}
                        </Tab>

                        <Tab eventKey="tenants" title="Tenants">
                            <Table responsive hover className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Tenant</th>
                                        <th>Contact</th>
                                        <th>Gender</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filterUsers(tenants, 'tenant').map((tenant) => (
                                        <tr key={tenant.id}>
                                            <td>
                                                <div className="user-cell">
                                                    {tenant.photoUrl ? (
                                                        <img
                                                            src={tenant.photoUrl}
                                                            alt={`${tenant.firstName} ${tenant.lastName}`}
                                                            className="user-avatar"
                                                            style={{ borderRadius: '50%', width: '40px', height: '40px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div className="user-avatar">
                                                            {tenant.firstName?.charAt(0) || 'T'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="user-name">
                                                            {`${tenant.firstName || ''} ${tenant.lastName || ''}`.trim() || 'N/A'}
                                                        </div>
                                                        <div className="user-email">{tenant.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{tenant.mobileNumber || 'N/A'}</td>
                                            <td>
                                                <Badge bg="secondary">{tenant.gender || 'N/A'}</Badge>
                                            </td>
                                            <td>{formatDate(tenant.createdAt)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        onClick={() => handleViewDetails(tenant)}
                                                        title="View Details"
                                                    >
                                                        <Eye size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {filterUsers(tenants, 'tenant').length === 0 && (
                                <div className="text-center py-5">
                                    <p style={{ color: 'var(--text-muted)' }}>No tenants found</p>
                                </div>
                            )}
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
                            <Row className="mb-3">
                                <Col xs={12} className="text-center mb-3">
                                    {selectedUser.profilePicture || selectedUser.photoUrl ? (
                                        <img
                                            src={selectedUser.profilePicture || selectedUser.photoUrl}
                                            alt={selectedUser.fullName || 'User'}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '3px solid var(--primary-blue)'
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-blue))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '2.5rem',
                                                color: 'white',
                                                margin: '0 auto'
                                            }}
                                        >
                                            {selectedUser.fullName?.charAt(0) || selectedUser.firstName?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <p><strong>Name:</strong> {selectedUser.fullName || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || 'N/A'}</p>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    <p><strong>Phone:</strong> {selectedUser.mobileNumber || 'N/A'}</p>
                                    {selectedUser.gender && <p><strong>Gender:</strong> {selectedUser.gender}</p>}
                                </Col>
                                <Col md={6}>
                                    {selectedUser.city && <p><strong>City:</strong> {selectedUser.city}</p>}
                                    {selectedUser.state && <p><strong>State:</strong> {selectedUser.state}</p>}
                                    {selectedUser.approvalStatus && (
                                        <p><strong>Status:</strong> {getStatusBadge(selectedUser.approvalStatus)}</p>
                                    )}
                                    <p><strong>Joined:</strong> {formatDate(selectedUser.createdAt)}</p>
                                    {selectedUser.idProof && (
                                        <p><strong>ID Proof:</strong> {selectedUser.idProof.type}</p>
                                    )}
                                </Col>
                            </Row>
                            {selectedUser.idProof?.url && (
                                <Row className="mt-3">
                                    <Col xs={12}>
                                        <p><strong>ID Proof Document:</strong></p>
                                        <a
                                            href={selectedUser.idProof.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <FileText size={14} className="me-2" />
                                            View Document
                                        </a>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default UserManagement
