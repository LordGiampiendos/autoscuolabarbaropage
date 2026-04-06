import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Badge, Form, Button, Alert, Card, Col, Image, Spinner, Row } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [userComment, setUserComment] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { user, authToken } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productRes, commentsRes] = await Promise.all([
                    axios.get(`https://serverautoscuolabarbaro.pagekite.me/api/products/public/${id}`),
                    axios.get(`https://serverautoscuolabarbaro.pagekite.me/api/comments/users/external/${id}`)
                ]);
                setProduct(productRes.data);
                setComments(commentsRes.data);

                if (authToken) {
                    try {
                        const userCommentRes = await axios.get(`https://serverautoscuolabarbaro.pagekite.me/api/comments/user/${id}`, {
                            headers: { Authorization: `Bearer ${authToken}` }
                        });
                        setUserComment(userCommentRes.data);
                        setCommentContent(userCommentRes.data.content);
                    } catch {
                        setUserComment(null);
                        setCommentContent('');
                    }
                } else {
                    setUserComment(null);
                    setCommentContent('');
                }
            } catch (err) {
                setErrorMessage('Error loading data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, authToken]);

    const handleCreateComment = async (e) => {
        setLoadingSubmit(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', commentContent);
        formData.append('productId', id);
        try {
            await axios.post('https://serverautoscuolabarbaro.pagekite.me/api/comments', formData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setLoadingSubmit(false);
            window.location.reload();
        } catch (error) {
            setErrorMessage('You cannot comment because you have not purchased this product.');
            setLoadingSubmit(false);
        }
    };

    const handleUpdateComment = async (e) => {
        setLoadingSubmit(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', commentContent);
        try {
            await axios.put(`https://serverautoscuolabarbaro.pagekite.me/api/comments/users/${userComment.commentId}`, formData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setLoadingSubmit(false);
            window.location.reload();
        } catch (error) {
            setErrorMessage('Error updating comment.');
            setLoadingSubmit(false);
        }
    };

    const handleDeleteComment = async () => {
        setLoadingDelete(true);
        try {
            await axios.delete(`https://serverautoscuolabarbaro.pagekite.me/api/comments/users/${userComment.commentId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setLoadingDelete(false);
            window.location.reload();
        } catch (error) {
            setErrorMessage('Error deleting comment.');
            setLoadingDelete(false);
        }
    };

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

    if (!product) return <Container>Product not found.</Container>;

    return (
        <Container className="mt-5">
            <Row className="justify-content-center mb-5">
                <Col md={8} lg={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title as="h2" className="fw-bold text-center">
                                {product.name}
                            </Card.Title>

                            <Card.Text className="text-center mt-3">
                                {product.description}
                            </Card.Text>

                            <Card.Text className="text-center fs-4 fw-bold">
                                €{product.price}
                            </Card.Text>

                            {product.demoUrl && (
                                <div className="text-center">
                                    <Image url={product.demoUrl} />
                                </div>
                            )}

                            <div className="d-flex justify-content-center mt-3">
                                <Badge bg="secondary" className="me-1">
                                    {product.tags}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            {user && (
                <div className="mt-5">
                    {userComment && !editing ? (
                        <Card>
                            <Card.Body>
                                <div className="d-flex align-items-center">
                                    <Image
                                        src={user.user.img || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAQlBMVEX////y8vK0tLT19fWwsLD6+vr4+Piurq7ExMS4uLjw8PC1tbXl5eXZ2dm9vb3IyMjf39/c3NzQ0NDMzMzU1NTk5PUEbEoQ+jEwdmhqxF8AiVqltY85RFS9gdnYAAA2kj9Oj3+VBxMgIFMjGAqA1mruRnl6NppvKv1XZr+zvUbbLYqvIbxzL+a4g+HqS23HLhkpPO3TZVgB17khD0g5Wr1Yjt0gDFZ28/fvMr90Wbg2gMxyRM8jlZAQDYbpBpj3qOW9zIg4Y5aqnZ5H8oWpEJlSm6cml94rME5y7w6A80UQAAAe0lEQVR4nOzda3LkqBgG4XzrcAStAGIFhE2gEJl5Tktt4PgsBMT9+m9VyyHqMvql5zOs4yAEw5ckDk4u7w4+nd5CjNRjt4IgD++nZP47dq/gp6jmJp9IzlSh0n2NBh+LgFc4u4J0+jf5LRvbwAlskF+wJrdw6hLBcCqu+nSmheV3OBZtEXHt0g6jmMNOvhx8sMIvhfoL8RswZz4aeT4hSZlbQzqIUR0t+VZoxEu/nQFCkZXKnw1A0O2Mz3V0zJXpfk8Uw19DE+wG4P8eF/dmVrlk8w/wgg7j8d11VmFfZL7reZpClcUlSfgC3ZoSl9g5hN59l6AAGd7mfSkNktTf9H4hbP7QAAAABJRU5ErkJggg=='}
                                        roundedCircle
                                        width={40}
                                        height={40}
                                    />
                                    <div className="ms-3">
                                        <strong>You</strong>
                                        <p>{userComment.content}</p>
                                    </div>
                                    <div className="d-flex flex-column align-items-end ms-3">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="mb-2"
                                            onClick={() => setEditing(true)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={handleDeleteComment}
                                        >
                                            {loadingDelete ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        className="me-2"
                                                    />
                                                    Deleting...
                                                </>
                                            ) : (
                                                'Delete'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Form onSubmit={editing ? handleUpdateComment : handleCreateComment}>
                            <Form.Control
                                as="textarea"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                rows={4}
                                placeholder="Write a comment..."
                                required
                            />
                            <Button variant="primary" type="submit" className="mt-3">
                                {loadingSubmit ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        {editing ? 'Updating...' : 'Posting...'}
                                    </>
                                ) : (
                                    editing ? 'Update Comment' : 'Post Comment'
                                )}
                            </Button>
                        </Form>
                    )}
                </div>
            )}

            <div className="mt-5">
                <h4 className="mb-3">Comments ({comments.length})</h4>
                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <Card key={comment.commentId} className="mb-3">
                            <Card.Body>
                                <div className="d-flex align-items-center mb-3">
                                    <Image
                                        src={comment.img || 'data:image/png;base64,...'}
                                        roundedCircle
                                        width={40}
                                        height={40}
                                    />
                                    <div className="ms-3">
                                        <strong>{comment.firstName} {comment.lastName}</strong><br />
                                        <small className="text-muted">@{comment.username}</small>
                                    </div>
                                </div>
                                <Card.Text>{comment.content}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>
        </Container>
    );
};

export default ProductDetailPage;