import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download, TrendingUp, Users, Building2, DollarSign } from 'lucide-react'

const Analytics = () => {
    const userGrowth = [
        { month: 'Jan', owners: 120, tenants: 450 },
        { month: 'Feb', owners: 145, tenants: 520 },
        { month: 'Mar', owners: 168, tenants: 680 },
        { month: 'Apr', owners: 195, tenants: 820 },
        { month: 'May', owners: 218, tenants: 950 },
        { month: 'Jun', owners: 245, tenants: 1100 }
    ]

    const revenueData = [
        { month: 'Jan', revenue: 280000 },
        { month: 'Feb', revenue: 320000 },
        { month: 'Mar', revenue: 350000 },
        { month: 'Apr', revenue: 380000 },
        { month: 'May', revenue: 420000 },
        { month: 'Jun', revenue: 458000 }
    ]

    const cityStats = [
        { city: 'Mumbai', revenue: 1200000, properties: 892 },
        { city: 'Delhi', revenue: 980000, properties: 756 },
        { city: 'Bangalore', revenue: 1100000, properties: 645 },
        { city: 'Pune', revenue: 750000, properties: 523 },
        { city: 'Hyderabad', revenue: 680000, properties: 487 }
    ]

    return (
        <Container fluid>
            <div className="page-header fade-in">
                <div>
                    <h2 className="page-title">Analytics & Reports</h2>
                    <p className="page-subtitle">Visual insights and performance trends</p>
                </div>
                <Button className="btn-primary">
                    <Download size={18} />
                    Export Report
                </Button>
            </div>

            {/* User Growth Chart */}
            <Card className="glass-card fade-in mb-4">
                <Card.Header className="chart-header">
                    <div>
                        <h5 className="chart-title">User Growth Trend</h5>
                        <p className="chart-subtitle">Monthly owners and tenants registration</p>
                    </div>
                </Card.Header>
                <Card.Body>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={userGrowth}>
                            <defs>
                                <linearGradient id="colorOwners" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                            <Area type="monotone" dataKey="owners" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOwners)" />
                            <Area type="monotone" dataKey="tenants" stroke="#10b981" fillOpacity={1} fill="url(#colorTenants)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>

            {/* Revenue and City Stats */}
            <Row className="g-4">
                <Col lg={6}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <div>
                                <h5 className="chart-title">Revenue Trend</h5>
                                <p className="chart-subtitle">Monthly revenue analysis</p>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={revenueData}>
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
                                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <div>
                                <h5 className="chart-title">City Performance</h5>
                                <p className="chart-subtitle">Revenue by top cities</p>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={cityStats}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
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
                                    <Bar dataKey="revenue" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Analytics
