import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap'

const Users = () => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active', joined: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Agent', status: 'Active', joined: '2024-02-20' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Customer', status: 'Inactive', joined: '2024-03-10' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Agent', status: 'Active', joined: '2024-04-05' },
        { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'Customer', status: 'Active', joined: '2024-05-12' }
    ]

    const getStatusBadge = (status) => {
        return status === 'Active'
            ? <Badge bg="success">{status}</Badge>
            : <Badge bg="secondary">{status}</Badge>
    }

    const getRoleBadge = (role) => {
        return role === 'Agent'
            ? <Badge bg="info">{role}</Badge>
            : <Badge bg="primary">{role}</Badge>
    }

    return (
        <Container fluid>
            <div className="page-header mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2>Users</h2>
                        <p className="text-muted mb-0">Manage all users</p>
                    </div>
                    <Button variant="primary">
                        + Add New User
                    </Button>
                </div>
            </div>

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">All Users</h5>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{getRoleBadge(user.role)}</td>
                                            <td>{getStatusBadge(user.status)}</td>
                                            <td>{user.joined}</td>
                                            <td>
                                                <Button variant="sm" size="sm" className="me-2">
                                                    Edit
                                                </Button>
                                                <Button variant="danger" size="sm">
                                                    Delete
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

export default Users
