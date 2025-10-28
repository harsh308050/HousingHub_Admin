import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Modal, Spinner, Badge, Table } from 'react-bootstrap'
import { Upload, Image as ImageIcon, Trash2, Edit2, Eye, EyeOff, Plus, X, ExternalLink } from 'lucide-react'
import { collection, getDocs, updateDoc, deleteDoc, doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloud_name'
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset'

const BannerManagement = () => {
    const [banners, setBanners] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const [editingBanner, setEditingBanner] = useState(null)
    const [previewBanner, setPreviewBanner] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        link: '',
        isActive: true,
        order: 1,
        image: null
    })

    useEffect(() => {
        fetchBanners()
    }, [])

    const fetchBanners = async () => {
        try {
            setLoading(true)
            const bannersSnapshot = await getDocs(collection(db, 'Banners'))
            const bannersData = bannersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            // Sort by order
            bannersData.sort((a, b) => (a.order || 0) - (b.order || 0))
            setBanners(bannersData)
        } catch (error) {
            console.error('Error fetching banners:', error)
            alert('Failed to load banners')
        } finally {
            setLoading(false)
        }
    }

    const handleImageSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB')
                return
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file')
                return
            }

            setFormData({ ...formData, image: file })

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        formData.append('folder', 'housinghub/banners')

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            )

            if (!response.ok) {
                throw new Error('Failed to upload image to Cloudinary')
            }

            const data = await response.json()
            return {
                url: data.secure_url,
                publicId: data.public_id
            }
        } catch (error) {
            console.error('Cloudinary upload error:', error)
            throw error
        }
    }

    const deleteImageFromCloudinary = async (publicId) => {
        // Note: Deleting from Cloudinary typically requires backend API
        // For now, we'll just remove the reference from Firestore
        // You may want to implement a backend endpoint for deletion
        console.log('Image deletion from Cloudinary:', publicId)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.image && !editingBanner) {
            alert('Please select an image')
            return
        }

        try {
            setUploading(true)

            if (editingBanner) {
                // Update existing banner
                let imageUrl = editingBanner.imageUrl
                let publicId = editingBanner.publicId

                // Upload new image if changed
                if (formData.image) {
                    const uploadResult = await uploadImageToCloudinary(formData.image)
                    imageUrl = uploadResult.url
                    publicId = uploadResult.publicId

                    // Delete old image from Cloudinary if exists
                    if (editingBanner.publicId) {
                        await deleteImageFromCloudinary(editingBanner.publicId)
                    }
                }

                // Check if title changed - need to create new doc and delete old one
                const sanitizedTitle = formData.title.trim().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_')
                if (sanitizedTitle !== editingBanner.id) {
                    // Title changed - create new document with new ID
                    const newBannerData = {
                        title: formData.title,
                        subtitle: formData.subtitle,
                        description: formData.description,
                        link: formData.link,
                        isActive: formData.isActive,
                        order: parseInt(formData.order),
                        imageUrl: imageUrl,
                        publicId: publicId,
                        createdAt: editingBanner.createdAt,
                        updatedAt: serverTimestamp()
                    }

                    // Create new document with new title as ID
                    await setDoc(doc(db, 'Banners', sanitizedTitle), newBannerData)

                    // Delete old document
                    await deleteDoc(doc(db, 'Banners', editingBanner.id))
                } else {
                    // Title unchanged - just update
                    const bannerRef = doc(db, 'Banners', editingBanner.id)
                    await updateDoc(bannerRef, {
                        title: formData.title,
                        subtitle: formData.subtitle,
                        description: formData.description,
                        link: formData.link,
                        isActive: formData.isActive,
                        order: parseInt(formData.order),
                        imageUrl: imageUrl,
                        publicId: publicId,
                        updatedAt: serverTimestamp()
                    })
                }

                alert('Banner updated successfully!')
            } else {
                // Add new banner
                // Upload image to Cloudinary first
                const uploadResult = await uploadImageToCloudinary(formData.image)

                // Create sanitized ID from title (remove special chars, replace spaces with underscores)
                const sanitizedTitle = formData.title.trim().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_')

                // Check if banner with this title already exists
                const existingBanner = await getDoc(doc(db, 'Banners', sanitizedTitle))
                if (existingBanner.exists()) {
                    alert('A banner with this title already exists. Please use a different title.')
                    setUploading(false)
                    return
                }

                const bannerData = {
                    title: formData.title,
                    subtitle: formData.subtitle,
                    description: formData.description,
                    link: formData.link,
                    isActive: formData.isActive,
                    order: parseInt(formData.order),
                    imageUrl: uploadResult.url,
                    publicId: uploadResult.publicId,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }

                // Use title as document ID
                await setDoc(doc(db, 'Banners', sanitizedTitle), bannerData)

                alert('Banner added successfully!')
            }

            // Reset form and refresh
            handleCloseModal()
            fetchBanners()
        } catch (error) {
            console.error('Error saving banner:', error)
            alert('Failed to save banner: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleEdit = (banner) => {
        setEditingBanner(banner)
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle || '',
            description: banner.description,
            link: banner.link || '',
            isActive: banner.isActive,
            order: banner.order || 1,
            image: null
        })
        setPreviewImage(banner.imageUrl)
        setShowModal(true)
    }

    const handleDelete = async (banner) => {
        if (!window.confirm(`Are you sure you want to delete "${banner.title}"?`)) {
            return
        }

        try {
            // Delete image from Cloudinary
            if (banner.publicId) {
                await deleteImageFromCloudinary(banner.publicId)
            }

            // Delete document from Firestore
            await deleteDoc(doc(db, 'Banners', banner.id))

            alert('Banner deleted successfully!')
            fetchBanners()
        } catch (error) {
            console.error('Error deleting banner:', error)
            alert('Failed to delete banner')
        }
    }

    const toggleStatus = async (banner) => {
        try {
            const bannerRef = doc(db, 'Banners', banner.id)
            await updateDoc(bannerRef, {
                isActive: !banner.isActive,
                updatedAt: serverTimestamp()
            })
            fetchBanners()
        } catch (error) {
            console.error('Error toggling status:', error)
            alert('Failed to update status')
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingBanner(null)
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            link: '',
            isActive: true,
            order: 1,
            image: null
        })
        setPreviewImage(null)
    }

    const handlePreview = (banner) => {
        setPreviewBanner(banner)
        setShowPreviewModal(true)
    }

    const handleClosePreview = () => {
        setShowPreviewModal(false)
        setPreviewBanner(null)
    }

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
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="page-title">Banner Management</h2>
                        <p className="page-subtitle">Manage app banners and promotional content</p>
                    </div>
                    <Button
                        className="btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        <Plus size={18} />
                        Add New Banner
                    </Button>
                </div>
            </div>

            <Card className="glass-card fade-in">
                <Card.Body>
                    <Table hover responsive style={{ marginBottom: 0 }}>
                        <thead>
                            <tr style={{
                                background: 'rgba(37, 99, 235, 0.1)',
                                borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
                            }}>
                                <th style={{ color: '#e2e8f0', fontWeight: '600', padding: '1rem' }}>Order</th>
                                <th style={{ color: '#e2e8f0', fontWeight: '600', padding: '1rem' }}>Preview</th>
                                <th style={{ color: '#e2e8f0', fontWeight: '600', padding: '1rem' }}>Title & Subtitle</th>
                                <th style={{ color: '#e2e8f0', fontWeight: '600', padding: '1rem' }}>Description</th>
                                <th style={{ color: '#e2e8f0', fontWeight: '600', padding: '1rem' }}>Link</th>
                                <th style={{ color: '#e2e8f0', fontWeight: '600', padding: '1rem' }}>Status</th>
                                <th style={{ color: '#e2e8f0', fontWeight: '600', padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{
                                        textAlign: 'center',
                                        padding: '3rem',
                                        color: '#94a3b8'
                                    }}>
                                        <ImageIcon size={48} style={{ marginBottom: '1rem' }} />
                                        <div>No banners found. Create your first banner!</div>
                                    </td>
                                </tr>
                            ) : (
                                banners.map((banner) => (
                                    <tr key={banner.id} style={{
                                        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                                        transition: 'background 0.2s'
                                    }}>
                                        <td style={{ color: '#e2e8f0', padding: '1rem', verticalAlign: 'middle' }}>
                                            {banner.order || 1}
                                        </td>
                                        <td style={{ padding: '0.5rem', verticalAlign: 'middle' }}>
                                            <img
                                                src={banner.imageUrl}
                                                alt={banner.title}
                                                style={{
                                                    width: '100px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(148, 163, 184, 0.2)',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => handlePreview(banner)}
                                            />
                                        </td>
                                        <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                                            <div style={{ color: '#e2e8f0', fontWeight: '500' }}>
                                                {banner.title}
                                            </div>
                                            {banner.subtitle && (
                                                <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                                    {banner.subtitle}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{
                                            color: '#cbd5e1',
                                            padding: '1rem',
                                            maxWidth: '250px',
                                            verticalAlign: 'middle'
                                        }}>
                                            <div style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                {banner.description}
                                            </div>
                                        </td>
                                        <td style={{
                                            color: '#60a5fa',
                                            padding: '1rem',
                                            maxWidth: '200px',
                                            verticalAlign: 'middle'
                                        }}>
                                            {banner.link ? (
                                                <a
                                                    href={banner.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: '#60a5fa',
                                                        textDecoration: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}
                                                >
                                                    <ExternalLink size={14} />
                                                    <span style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {banner.link}
                                                    </span>
                                                </a>
                                            ) : (
                                                <span style={{ color: '#64748b' }}>No link</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                                            <Button
                                                size="sm"
                                                variant={banner.isActive ? 'success' : 'secondary'}
                                                onClick={() => toggleStatus(banner)}
                                                style={{
                                                    minWidth: '80px',
                                                    opacity: 0.9
                                                }}
                                            >
                                                {banner.isActive ? 'Active' : 'Inactive'}
                                            </Button>
                                        </td>
                                        <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleEdit(banner)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}
                                                >
                                                    <Edit2 size={14} />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(banner)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        borderRadius: '0.8rem'
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Add/Edit Banner Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                    color: '#e2e8f0'
                }}>
                    <Modal.Title>
                        {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                    </Modal.Title>
                    <Button
                        variant="link"
                        onClick={handleCloseModal}
                        style={{ color: '#94a3b8' }}
                    >
                        <X size={24} />
                    </Button>
                </Modal.Header>
                <Modal.Body style={{ background: 'rgba(15, 23, 42, 0.95)', color: '#e2e8f0' }}>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Banner Title *
                                        <small className="ms-2" style={{ color: '#94a3b8' }}>
                                            ({formData.title.length}/22 characters)
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g., Summer Special"
                                        value={formData.title}
                                        onChange={(e) => {
                                            const value = e.target.value.slice(0, 22)
                                            setFormData({ ...formData, title: value })
                                        }}
                                        maxLength={22}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Banner Subtitle
                                        <small className="ms-2" style={{ color: '#94a3b8' }}>
                                            ({formData.subtitle.length}/44 characters)
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g., Get 20% off on your first booking"
                                        value={formData.subtitle}
                                        onChange={(e) => {
                                            const value = e.target.value.slice(0, 44)
                                            setFormData({ ...formData, subtitle: value })
                                        }}
                                        maxLength={44}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Order</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        label={formData.isActive ? 'Active' : 'Inactive'}
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        style={{ marginTop: '0.5rem' }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Description *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Brief description of the banner"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Link (Optional)</Form.Label>
                            <Form.Control
                                type="url"
                                placeholder="https://example.com"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Banner Image * (Max 5MB)</Form.Label>
                            <div
                                className="upload-area"
                                style={{
                                    border: '2px dashed rgba(148, 163, 184, 0.3)',
                                    borderRadius: '12px',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: 'rgba(15, 23, 42, 0.4)'
                                }}
                                onClick={() => document.getElementById('banner-upload').click()}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    style={{ display: 'none' }}
                                    id="banner-upload"
                                />
                                {previewImage ? (
                                    <div>
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                borderRadius: '8px',
                                                marginBottom: '1rem'
                                            }}
                                        />
                                        <p style={{ color: '#10b981', margin: 0 }}>
                                            ✓ Image selected - Click to change
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <Upload size={32} style={{ color: '#3b82f6', marginBottom: '0.5rem' }} />
                                        <p style={{ color: '#94a3b8', margin: 0 }}>
                                            Click to upload banner image
                                        </p>
                                        <small style={{ color: '#64748b' }}>
                                            Recommended: 1200x400px, JPG or PNG
                                        </small>
                                    </div>
                                )}
                            </div>
                        </Form.Group>

                        <div className="d-flex gap-2 justify-content-end">
                            <Button
                                variant="secondary"
                                onClick={handleCloseModal}
                                disabled={uploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="btn-primary"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <Spinner animation="border" size="sm" /> Uploading...
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon size={18} />
                                        {editingBanner ? 'Update Banner' : 'Add Banner'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Banner Preview Modal */}
            <Modal
                show={showPreviewModal}
                onHide={handleClosePreview}
                size="lg"
                centered
            >
                <Modal.Header style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                    color: '#e2e8f0'
                }}>
                    <Modal.Title>Banner Preview</Modal.Title>
                    <Button
                        variant="link"
                        onClick={handleClosePreview}
                        style={{ color: '#94a3b8' }}
                    >
                        <X size={24} />
                    </Button>
                </Modal.Header>
                <Modal.Body style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    color: '#e2e8f0',
                    padding: 0
                }}>
                    {previewBanner && (
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '400px',
                            overflow: 'hidden',
                            borderRadius: '12px'
                        }}>
                            <img
                                src={previewBanner.imageUrl}
                                alt={previewBanner.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                                padding: '3rem 2rem 2rem'
                            }}>
                                <h2 style={{
                                    color: 'white',
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                    marginBottom: '0.5rem',
                                    textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
                                }}>
                                    {previewBanner.title}
                                </h2>
                                {previewBanner.subtitle && (
                                    <p style={{
                                        color: 'rgba(255,255,255,0.95)',
                                        fontSize: '1.1rem',
                                        marginBottom: 0,
                                        textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
                                    }}>
                                        {previewBanner.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default BannerManagement
