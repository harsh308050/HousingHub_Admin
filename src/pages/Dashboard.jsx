import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, Building2, CreditCard } from 'lucide-react'
import { db } from '../config/firebase'
import { collection, getDocs, collectionGroup } from 'firebase/firestore'
import './Dashboard.css'

// Helper functions
const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN') || 0}`
}



const generateMonthlyData = (bookings) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    const monthlyStats = {}

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12
        const monthName = months[monthIndex]
        monthlyStats[monthName] = { revenue: 0, bookings: 0 }
    }

    // Aggregate bookings by month
    bookings.forEach(booking => {
        if (booking.createdAt && booking.status === 'Completed') {
            const date = booking.createdAt.toDate()
            const monthName = months[date.getMonth()]
            if (monthlyStats[monthName]) {
                monthlyStats[monthName].revenue += booking.paymentInfo?.amount || 0
                monthlyStats[monthName].bookings += 1
            }
        }
    })

    return Object.entries(monthlyStats).map(([month, data]) => ({
        month,
        revenue: data.revenue,
        bookings: data.bookings
    }))
}



const Dashboard = () => {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalOwners: 0,
        totalTenants: 0,
        totalProperties: 0,
        activeProperties: 0,
        totalRevenue: 0,
        completedBookings: 0,
        pendingBookings: 0
    })
    const [revenueData, setRevenueData] = useState([])
    const [propertyTypes, setPropertyTypes] = useState([])

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)

                // Fetch all collections in parallel
                const [ownersSnap, tenantsSnap, propertiesSnap, bookingsSnap] = await Promise.all([
                    getDocs(collection(db, 'Owners')),
                    getDocs(collection(db, 'Tenants')),
                    getDocs(collectionGroup(db, 'Available')),
                    getDocs(collection(db, 'Bookings'))
                ])

                // Process Owners
                const totalOwners = ownersSnap.size

                // Process Tenants
                const totalTenants = tenantsSnap.size

                // Process Properties
                const allProperties = propertiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                const totalProperties = allProperties.length
                const activeProperties = allProperties.filter(p => p.isAvailable).length

                // Process Bookings
                const allBookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                const completedBookings = allBookings.filter(b => b.status === 'Completed')
                const pendingBookings = allBookings.filter(b => b.status === 'Pending')

                // Calculate total revenue from completed bookings
                const totalRevenue = completedBookings.reduce((sum, booking) =>
                    sum + (booking.paymentInfo?.amount || 0), 0
                )

                // Group properties by state
                const stateCounts = {}
                allProperties.forEach(property => {
                    const state = property.state || 'Unknown'
                    stateCounts[state] = (stateCounts[state] || 0) + 1
                })

                // Group properties by type
                const typeCounts = {}
                allProperties.forEach(property => {
                    const type = property.propertyType || 'Others'
                    typeCounts[type] = (typeCounts[type] || 0) + 1
                })
                const propertyTypesData = Object.entries(typeCounts).map(([name, value], index) => ({
                    name,
                    value,
                    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]
                }))

                // Generate monthly revenue data (last 6 months)
                const monthlyData = generateMonthlyData(allBookings)

                // Generate recent activities

                setStats({
                    totalOwners,
                    totalTenants,
                    totalProperties,
                    activeProperties,
                    totalRevenue,
                    completedBookings: completedBookings.length,
                    pendingBookings: pendingBookings.length
                })

                setPropertyTypes(propertyTypesData)
                setRevenueData(monthlyData)

            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    const statsDisplay = [
        {
            title: 'Total Owners',
            value: stats.totalOwners.toLocaleString(),
            icon: Users,
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        },
        {
            title: 'Total Tenants',
            value: stats.totalTenants.toLocaleString(),
            icon: Users,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        {
            title: 'Active Properties',
            value: `${stats.activeProperties}/${stats.totalProperties}`,
            icon: Building2,
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        },
        {
            title: 'Total Revenue',
            value: formatPrice(stats.totalRevenue),
            icon: CreditCard,
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        }
    ]

    if (loading) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3" style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
                </div>
            </Container>
        )
    }

    return (
        <Container fluid className="dashboard-container">
            <div className="page-header fade-in">
                <div>
                    <h2 className="page-title">Dashboard Overview</h2>
                    <p className="page-subtitle">Welcome back! Here's what's happening with HousingHub today.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <Row className="g-4 mb-4">
                {statsDisplay.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Col key={index} xs={12} sm={6} lg={3}>
                            <Card className="stat-card glass-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <Card.Body>
                                    <div className="stat-content">
                                        <div className="stat-info">
                                            <p className="stat-label">{stat.title}</p>
                                            <h3 className="stat-value">{stat.value}</h3>
                                        </div>
                                        <div className="stat-icon" style={{ background: stat.gradient }}>
                                            <Icon size={28} />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
            </Row>

            {/* Charts Row */}
            <Row className="g-4 mb-4">
                <Col lg={8}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <div>
                                <h5 className="chart-title">Revenue & Bookings Trend</h5>
                                <p className="chart-subtitle">Monthly performance overview</p>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                                    <XAxis dataKey="month" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                            border: '1px solid rgba(148, 163, 184, 0.2)',
                                            borderRadius: '8px',
                                            color: '#f1f5f9'
                                        }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRevenue)" />
                                    <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <div>
                                <h5 className="chart-title">Property Distribution</h5>
                                <p className="chart-subtitle">By property type</p>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={propertyTypes}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {propertyTypes.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                            border: '1px solid rgba(148, 163, 184, 0.2)',
                                            borderRadius: '8px',
                                            color: '#f1f5f9'
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* State wise and Activities */}

        </Container>
    )
}

export default Dashboard
