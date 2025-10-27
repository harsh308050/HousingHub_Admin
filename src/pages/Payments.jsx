import { useState, useEffect, useCallback } from 'react'
import { Container, Row, Col, Card, Table, Badge, Form, Spinner } from 'react-bootstrap'
import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

// Helper functions outside component
const formatPrice = (price) => {
    if (!price) return '₹0'
    return `₹${price.toLocaleString('en-IN')}`
}

const formatDate = (date) => {
    if (!date) return 'N/A'
    try {
        const dateObj = date.toDate ? date.toDate() : new Date(date)
        return dateObj.toLocaleDateString('en-IN')
    } catch {
        return 'N/A'
    }
}

const calculateStats = (paymentsData) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let totalRevenue = 0
    let thisMonthRevenue = 0
    let pendingAmount = 0

    paymentsData.forEach(payment => {
        const amount = payment.amount || 0

        // Total revenue from completed payments
        if (payment.status === 'completed') {
            totalRevenue += amount

            // This month's revenue
            const paymentDate = payment.date?.toDate ? payment.date.toDate() : new Date(payment.date)
            if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
                thisMonthRevenue += amount
            }
        }

        // Pending amount
        if (payment.status === 'pending') {
            pendingAmount += amount
        }
    })

    return {
        totalRevenue,
        thisMonth: thisMonthRevenue,
        totalTransactions: paymentsData.length,
        pendingAmount
    }
}

const Payments = () => {
    const [payments, setPayments] = useState([])
    const [filteredPayments, setFilteredPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [stats, setStats] = useState({
        totalRevenue: 0,
        thisMonth: 0,
        totalTransactions: 0,
        pendingAmount: 0
    })

    const fetchPayments = async () => {
        try {
            setLoading(true)

            // Fetch all bookings from root Bookings collection
            const bookingsSnapshot = await getDocs(collection(db, 'Bookings'))
            const bookingsData = []

            bookingsSnapshot.forEach((doc) => {
                const data = doc.data()

                // Extract payment information from booking
                const payment = {
                    id: data.paymentInfo?.paymentId || doc.id,
                    bookingId: doc.id,
                    // Handle multiple possible field name formats
                    tenant: data.tenantData?.fullName || data.tenantInfo?.name || data.tenantName || 'N/A',
                    tenantEmail: data.tenantData?.email || data.tenantInfo?.email || data.tenantEmail || 'N/A',
                    property: data.propertyData?.title || data.propertyInfo?.title || data.propertyTitle || 'N/A',
                    propertyId: data.propertyData?.id || data.propertyInfo?.id || data.propertyId || 'N/A',
                    propertyAddress: data.propertyData?.address || data.propertyInfo?.address || data.propertyAddress || 'N/A',
                    owner: data.ownerData?.fullName || data.ownerInfo?.name || data.ownerName || 'N/A',
                    ownerEmail: data.ownerData?.email || data.ownerInfo?.email || data.ownerEmail || 'N/A',
                    amount: data.paymentInfo?.amount || 0,
                    date: data.paymentInfo?.completedAt || data.createdAt,
                    status: data.paymentInfo?.status?.toLowerCase() || 'pending',
                    method: data.paymentInfo?.paymentMethod || 'Razorpay',
                    bookingStatus: data.bookingStatus || data.status || 'Pending'
                }

                bookingsData.push(payment)
            })

            // Sort by date (newest first)
            bookingsData.sort((a, b) => {
                const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
                const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
                return dateB - dateA
            })

            setPayments(bookingsData)
            setStats(calculateStats(bookingsData))
        } catch (error) {
            console.error('Error fetching payments:', error)
        } finally {
            setLoading(false)
        }
    }

    const applyFilter = useCallback(() => {
        if (filterStatus === 'all') {
            setFilteredPayments(payments)
        } else {
            setFilteredPayments(payments.filter(p => p.status === filterStatus))
        }
    }, [filterStatus, payments])

    useEffect(() => {
        fetchPayments()
    }, [])

    useEffect(() => {
        applyFilter()
    }, [applyFilter])

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value)
    }

    const getStatusBadge = (status) => {
        const variants = {
            completed: 'success',
            pending: 'warning',
            failed: 'danger'
        }
        return <Badge bg={variants[status]}>{status.toUpperCase()}</Badge>
    }

    const statsDisplay = [
        {
            label: 'Total Revenue',
            value: formatPrice(stats.totalRevenue),
            icon: DollarSign,
            color: '#10b981'
        },
        {
            label: 'This Month',
            value: formatPrice(stats.thisMonth),
            icon: TrendingUp,
            color: '#3b82f6'
        },
        {
            label: 'Transactions',
            value: stats.totalTransactions.toString(),
            icon: CreditCard,
            color: '#f59e0b'
        },
        {
            label: 'Pending',
            value: formatPrice(stats.pendingAmount),
            icon: Calendar,
            color: '#ef4444'
        }
    ]

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
                <h2 className="page-title">Payment Management</h2>
                <p className="page-subtitle">Track all payment transactions</p>
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
                    <div className="table-controls mb-3">
                        <Form.Select
                            className="filter-select"
                            style={{ maxWidth: '200px' }}
                            value={filterStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="all">All Transactions</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </Form.Select>
                    </div>

                    <Table responsive hover className="custom-table">
                        <thead>
                            <tr>
                                <th style={{ minWidth: '150px' }}>Transaction ID</th>
                                <th style={{ minWidth: '180px' }}>Tenant</th>
                                <th style={{ minWidth: '180px' }}>Property</th>
                                <th style={{ minWidth: '180px' }}>Owner</th>
                                <th style={{ minWidth: '100px' }}>Amount</th>
                                <th style={{ minWidth: '110px' }}>Date</th>
                                <th style={{ minWidth: '110px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{payment.id}</td>
                                        <td>
                                            <div style={{ lineHeight: '1.4' }}>
                                                <div style={{ fontWeight: '500', color: '#e2e8f0' }}>{payment.tenant}</div>
                                                <small style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>
                                                    {payment.tenantEmail}
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ lineHeight: '1.4' }}>
                                                <div style={{ fontWeight: '500', color: '#e2e8f0' }}>{payment.property}</div>
                                                <small style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>
                                                    ID: {payment.propertyId}
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ lineHeight: '1.4' }}>
                                                <div style={{ fontWeight: '500', color: '#e2e8f0' }}>{payment.owner}</div>
                                                <small style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>
                                                    {payment.ownerEmail}
                                                </small>
                                            </div>
                                        </td>
                                        <td className="price-cell">{formatPrice(payment.amount)}</td>
                                        <td style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{formatDate(payment.date)}</td>
                                        <td>{getStatusBadge(payment.status)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted py-4">
                                        No payments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Payments
