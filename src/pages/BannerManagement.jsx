import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react'

const BannerManagement = () => {
    const [banners, setBanners] = useState([
        { id: 1, title: 'Welcome to HousingHub', text: 'Find your perfect PG accommodation', image: '🏠' },
        { id: 2, title: 'Special Offer', text: '20% off on first month rent', image: '🎉' },
        { id: 3, title: 'New Listings', text: 'Check out latest properties', image: '🆕' }
    ])

    const [newBanner, setNewBanner] = useState({
        title: '',
        text: '',
        image: null
    })

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // In real implementation, upload to Firebase Storage
            console.log('Uploading image:', file)
            setNewBanner({ ...newBanner, image: file })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const banner = {
            id: banners.length + 1,
            ...newBanner,
            image: '📢'
        }
        setBanners([...banners, banner])
        setNewBanner({ title: '', text: '', image: null })
        alert('Banner added successfully!')
    }

    const handleDelete = (id) => {
        setBanners(banners.filter(b => b.id !== id))
    }

    return (
        <Container fluid>
            <div className="page-header fade-in">
                <div>
                    <h2 className="page-title">Banner Management</h2>
                    <p className="page-subtitle">Manage app banners and promotional content</p>
                </div>
            </div>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <h5 className="chart-title">Active Banners</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                {banners.map((banner) => (
                                    <Col key={banner.id} xs={12}>
                                        <Card className="glass-card">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="d-flex gap-3 align-items-center">
                                                        <div style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
                                                            borderRadius: '12px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '2rem'
                                                        }}>
                                                            {banner.image}
                                                        </div>
                                                        <div>
                                                            <h6 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                                                {banner.title}
                                                            </h6>
                                                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                                                                {banner.text}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        onClick={() => handleDelete(banner.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="glass-card fade-in">
                        <Card.Header className="chart-header">
                            <h5 className="chart-title">Add New Banner</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Banner Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter title"
                                        value={newBanner.title}
                                        onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Banner Text</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter description"
                                        value={newBanner.text}
                                        onChange={(e) => setNewBanner({ ...newBanner, text: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Upload Image</Form.Label>
                                    <div className="upload-area" style={{
                                        border: '2px dashed rgba(148, 163, 184, 0.3)',
                                        borderRadius: '12px',
                                        padding: '2rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                            id="banner-upload"
                                        />
                                        <label htmlFor="banner-upload" style={{ cursor: 'pointer' }}>
                                            <Upload size={32} style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }} />
                                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                                                Click to upload image
                                            </p>
                                            {newBanner.image && (
                                                <small style={{ color: 'var(--success-color)' }}>
                                                    ✓ Image selected
                                                </small>
                                            )}
                                        </label>
                                    </div>
                                </Form.Group>

                                <Button type="submit" className="btn-primary w-100">
                                    <ImageIcon size={18} />
                                    Add Banner
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default BannerManagement
