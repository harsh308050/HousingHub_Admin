import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap'

const Bookings = () => {
    const bookings = [
        { id: 1, property: 'Sunset Villa', customer: 'John Doe', date: '2024-06-15', status: 'Confirmed', amount: '$2,500' },
        { id: 2, property: 'Ocean View Apartment', customer: 'Jane Smith', date: '2024-06-20', status: 'Pending', amount: '$1,800' },
        { id: 3, property: 'Mountain Retreat', customer: 'Mike Johnson', date: '2024-06-25', status: 'Confirmed', amount: '$3,200' },
        { id: 4, property: 'City Center Studio', customer: 'Sarah Williams', date: '2024-07-01', status: 'Cancelled', amount: '$950' },
        { id: 5, property: 'Lakeside Bungalow', customer: 'Tom Brown', date: '2024-07-05', status: 'Confirmed', amount: '$4,200' }
    ]

    const getStatusBadge = (status) => {
        const variants = {
            'Confirmed': 'success',
            'Pending': 'warning',
            'Cancelled': 'danger'
        }
        return <Badge bg={variants[status] || 'primary'}>{status}</Badge>
    }

    return (
        <Container fluid>
            <div className="page-header mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2>Bookings</h2>
                        <p className="text-muted mb-0">Manage all bookings</p>
                    </div>
                    <Button variant="primary">
                        + Add New Booking
                    </Button>
                </div>
            </div>

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">All Bookings</h5>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Property</th>
                                        <th>Customer</th>
                                        <th>Booking Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td>{booking.id}</td>
                                            <td>{booking.property}</td>
                                            <td>{booking.customer}</td>
                                            <td>{booking.date}</td>
                                            <td>{booking.amount}</td>
                                            <td>{getStatusBadge(booking.status)}</td>
                                            <td>
                                                <Button variant="sm" size="sm" className="me-2">
                                                    View
                                                </Button>
                                                <Button variant="danger" size="sm">
                                                    Cancel
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Bookings
