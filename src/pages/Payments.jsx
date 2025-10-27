import { Container, Row, Col, Card, Table, Badge, Form } from 'react-bootstrap'
import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react'

const Payments = () => {
    const payments = [
        { id: 'TXN001', tenant: 'Arjun Mehta', property: 'Sunset Villa PG', amount: '₹8,500', date: '2024-06-15', status: 'completed', method: 'Razorpay' },
        { id: 'TXN002', tenant: 'Neha Gupta', property: 'Cozy 2BHK', amount: '₹15,000', date: '2024-06-18', status: 'completed', method: 'Razorpay' },
        { id: 'TXN003', tenant: 'Karan Joshi', property: 'Student Hostel', amount: '₹7,000', date: '2024-06-20', status: 'pending', method: 'Bank Transfer' },
        { id: 'TXN004', tenant: 'Pooja Nair', property: 'Single Room', amount: '₹6,500', date: '2024-06-22', status: 'completed', method: 'Razorpay' },
        { id: 'TXN005', tenant: 'Rahul Verma', property: 'Luxury Villa', amount: '₹45,000', date: '2024-06-25', status: 'failed', method: 'Razorpay' }
    ]

    const stats = [
        { label: 'Total Revenue', value: '₹45.8L', icon: DollarSign, color: '#10b981', change: '+23.1%' },
        { label: 'This Month', value: '₹6.2L', icon: TrendingUp, color: '#3b82f6', change: '+18.5%' },
        { label: 'Transactions', value: '2,456', icon: CreditCard, color: '#f59e0b', change: '+15.2%' },
        { label: 'Pending', value: '₹1.2L', icon: Calendar, color: '#ef4444', change: '+5.3%' }
    ]

    const getStatusBadge = (status) => {
        const variants = {
            completed: 'success',
            pending: 'warning',
            failed: 'danger'
        }
        return <Badge bg={variants[status]}>{status.toUpperCase()}</Badge>
    }

    return (
        <Container fluid>
            <div className="page-header fade-in">
                <h2 className="page-title">Payment Management</h2>
                <p className="page-subtitle">Track all payment transactions</p>
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
                                            <small className="stat-change up">{stat.change}</small>
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
                        <Form.Select className="filter-select" style={{ maxWidth: '200px' }}>
                            <option>All Transactions</option>
                            <option>Completed</option>
                            <option>Pending</option>
                            <option>Failed</option>
                        </Form.Select>
                    </div>

                    <Table responsive hover className="custom-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Tenant</th>
                                <th>Property</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="text-muted">{payment.id}</td>
                                    <td>{payment.tenant}</td>
                                    <td>{payment.property}</td>
                                    <td className="price-cell">{payment.amount}</td>
                                    <td>{payment.date}</td>
                                    <td><Badge bg="info">{payment.method}</Badge></td>
                                    <td>{getStatusBadge(payment.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Payments
