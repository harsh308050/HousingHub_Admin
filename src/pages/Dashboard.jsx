import { Container, Row, Col, Card } from 'react-bootstrap'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Building2, CreditCard, ArrowUp, ArrowDown } from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
    const stats = [
        {
            title: 'Total Owners',
            value: '1,245',
            change: '+12.5%',
            trend: 'up',
            icon: Users,
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        },
        {
            title: 'Total Tenants',
            value: '8,567',
            change: '+18.2%',
            trend: 'up',
            icon: Users,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        {
            title: 'Active Properties',
            value: '3,892',
            change: '+8.7%',
            trend: 'up',
            icon: Building2,
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        },
        {
            title: 'Total Revenue',
            value: '₹45.8L',
            change: '+23.1%',
            trend: 'up',
            icon: CreditCard,
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        }
    ]

    const revenueData = [
        { month: 'Jan', revenue: 28000, bookings: 145 },
        { month: 'Feb', revenue: 32000, bookings: 168 },
        { month: 'Mar', revenue: 35000, bookings: 182 },
        { month: 'Apr', revenue: 38000, bookings: 195 },
        { month: 'May', revenue: 42000, bookings: 218 },
        { month: 'Jun', revenue: 45800, bookings: 235 }
    ]

    const cityData = [
        { city: 'Mumbai', properties: 892 },
        { city: 'Delhi', properties: 756 },
        { city: 'Bangalore', properties: 645 },
        { city: 'Pune', properties: 523 },
        { city: 'Hyderabad', properties: 487 },
        { city: 'Chennai', properties: 389 }
    ]

    const propertyTypes = [
        { name: 'PG', value: 45, color: '#3b82f6' },
        { name: 'Flat', value: 30, color: '#10b981' },
        { name: 'Room', value: 15, color: '#f59e0b' },
        { name: 'House', value: 10, color: '#8b5cf6' }
    ]

    const recentActivities = [
        { type: 'success', icon: '✅', text: 'New property listed in Mumbai', time: '2 mins ago' },
        { type: 'info', icon: '👤', text: 'New tenant registered', time: '15 mins ago' },
        { type: 'success', icon: '💰', text: 'Payment received - ₹25,000', time: '1 hour ago' },
        { type: 'warning', icon: '⚠️', text: 'Property verification pending', time: '2 hours ago' },
        { type: 'success', icon: '🏠', text: 'Property approved in Bangalore', time: '3 hours ago' }
    ]

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
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown
                    return (
                        <Col key={index} xs={12} sm={6} lg={3}>
                            <Card className="stat-card glass-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <Card.Body>
                                    <div className="stat-content">
                                        <div className="stat-info">
                                            <p className="stat-label">{stat.title}</p>
                                            <h3 className="stat-value">{stat.value}</h3>
                                            <div className={`stat-change ${stat.trend}`}>
                                                <TrendIcon size={14} />
                                                <span>{stat.change} from last month</span>
                                            </div>
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

            {/* City wise and Activities */}
            <Row className="g-4">
                <Col lg={8}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <div>
                                <h5 className="chart-title">Properties by City</h5>
                                <p className="chart-subtitle">Top performing cities</p>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={cityData}>
                                    <defs>
                                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={1} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                                    <XAxis dataKey="city" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                            border: '1px solid rgba(148, 163, 184, 0.2)',
                                            borderRadius: '8px',
                                            color: '#f1f5f9'
                                        }}
                                    />
                                    <Bar dataKey="properties" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <h5 className="chart-title">Recent Activities</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="activity-list">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className={`activity-item ${activity.type}`}>
                                        <span className="activity-icon">{activity.icon}</span>
                                        <div className="activity-content">
                                            <p className="activity-text">{activity.text}</p>
                                            <small className="activity-time">{activity.time}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Dashboard
