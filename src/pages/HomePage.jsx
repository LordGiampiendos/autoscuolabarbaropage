import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Image, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { FaCar, FaMotorcycle, FaChalkboardTeacher } from 'react-icons/fa';

const HomePage = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        updateComments();
    }, []);

    const updateComments = () => {
        setLoading(true);
        axios.get('https://serverautoscuola.pagekite.me/api/comments/comments')
            .then(response => {
                setComments(response.data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
            });
    }

    if (loading) {
        return (
            <Container className="mt-4">
                <div className="loader">
                    <Spinner animation="border" variant="primary" />
                    <span className="ms-2">Loading...</span>
                </div>
            </Container>
        );
    }

    return (
        <>
            <Container
                fluid
                style={{ background: 'rgba(169, 169, 169, 0.5)' }}
                className="text-center py-5 mb-5 rounded-lg shadow-lg"
            >
                <h1 className="display-4 mb-4 text-secondary font-weight-bold" style={{ lineHeight: '1.2' }}>
                    Your Trusted Driving School
                </h1>
                <p
                    className="lead mb-4 text-darkslategray glowing-text"
                    style={{ fontSize: '1.2rem', fontWeight: '300' }}
                >
                    We guide you step by step toward getting your driver’s license.
                </p>
                <Button
                    href="#services"
                    variant="light"
                    size="lg"
                    className="shadow-lg rounded-pill px-4 py-2"
                    style={{ textTransform: 'uppercase', fontWeight: '600' }}
                >
                    Discover Our Services
                </Button>
            </Container>
    
            <Container id="services" className="mb-5">
                <h2 className="mb-5 text-center display-4 text-secondary">Our Services</h2>
                <Row className="d-flex justify-content-center">
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-lg border-0 rounded-lg transition-all" style={{ backgroundColor: 'rgba(169, 169, 169, 0.1)' }}>
                            <Card.Body className="p-5 text-center">
                                <FaCar size={60} className="mb-4 text-secondary" />
                                <Card.Title className="h4 text-dark">Car License (Class B)</Card.Title>
                                <Card.Text className="text-muted">
                                    Theory and practical lessons to help you get your car license quickly and easily.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-lg border-0 rounded-lg transition-all" style={{ backgroundColor: 'rgba(169, 169, 169, 0.1)' }}>
                            <Card.Body className="p-5 text-center">
                                <FaMotorcycle size={60} className="mb-4 text-secondary" />
                                <Card.Title className="h4 text-dark">Motorcycle Licenses</Card.Title>
                                <Card.Text className="text-muted">
                                    Complete training for A1, A2, and A licenses with certified instructors.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-lg border-0 rounded-lg transition-all" style={{ backgroundColor: 'rgba(169, 169, 169, 0.1)' }}>
                            <Card.Body className="p-5 text-center">
                                <FaChalkboardTeacher size={60} className="mb-4 text-secondary" />
                                <Card.Title className="h4 text-dark">Theory Courses</Card.Title>
                                <Card.Text className="text-muted">
                                    Interactive lessons and updated quizzes to help you pass the theory exam stress-free.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
    
            <Container className="mb-5">
                <h2 className="mb-5 text-center display-4 text-secondary">What Our Students Say</h2>
                <Row>
                    {comments.length > 0 ? comments.map(comment => (
                        <Col md={6} lg={4} key={comment.commentId}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-3">
                                        <Image
                                            src={comment.img || 'data:image/png;base64,...'}
                                            roundedCircle
                                            width={50}
                                            height={50}
                                            className="me-3"
                                            alt={`${comment.username}'s avatar`}
                                        />
                                        <div>
                                            <strong>{comment.firstName} {comment.lastName}</strong><br />
                                            <small className="text-muted">@{comment.username}</small>
                                        </div>
                                    </div>
                                    <Card.Text>{comment.content}</Card.Text>
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    <small>{new Date(comment.createdAt).toLocaleDateString()}</small><br />
                                    <em>Course: {comment.productName}</em><br />
                                    {comment.demoUrl && (
                                        <a href={comment.demoUrl} target="_blank" rel="noopener noreferrer">
                                            Learn more
                                        </a>
                                    )}
                                </Card.Footer>
                            </Card>
                        </Col>
                    )) : (
                        <p className="text-center">No reviews available.</p>
                    )}
                </Row>
            </Container>
        </>
    );
}

export default HomePage;