import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import Comment from '../Components/CommentComponet';
import FormattedDate from '../Components/FormattedDate';
import PaginationComponent from '../Components/PaginationComponet';

const PostScreen = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10;
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(comments.length / commentsPerPage);
    const firstComment = currentComments.length > 0 ? currentComments[0] : null;
    const remainingComments = currentComments.slice(1);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/forum/posts/${id}`);
                setPost(response.data);
                setComments(response.data.comments);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [id]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = async () => {
        const username = localStorage.getItem('username');

        if (!username) {
            setError('User not logged in');
            return;
        }

        const commentData = {
            content: newComment,
            username,
        };

        try {
            const response = await axios.post(`/api/forum/posts/${id}/createComment`, commentData);
            setNewComment(commentData.content);
            setPost(response.data);
            setComments(response.data.comments);
            navigate(0);
        } catch (error) {
            console.error('Error adding comment:', error);
            setError('Failed to add comment');
        }
    };

    return (
        <Container>
            <div className="mt-4">
                {post ? (
                    <Card>
                        <Card.Header className="bg-primary text-light">
                            <h3>{post.title}</h3>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Card.Title>Posted by: {post.username}</Card.Title>
                                <div style={{ fontSize: '1rem', color: 'black' }}><FormattedDate date={post.createdAt} /></div>
                            </div>
                        </Card.Body>
                    </Card>
                ) : (
                    <Alert variant="info">Loading post...</Alert>
                )}

                <Card className="mt-4">
                    <Card.Header className="bg-primary text-light">
                        <h3>Comments</h3>
                    </Card.Header>
                    <Card.Body>
                        {firstComment && (
                            <Card style={{ backgroundColor: '#B2FFF2', color: 'black', minHeight: "200px" }} className="mb-3">
                                <Card.Body>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Card.Title>Commented by: {firstComment.username}</Card.Title>
                                        <div style={{ fontSize: '1rem', color: 'black' }}><FormattedDate date={post.createdAt} /></div>
                                    </div>
                                    <hr />
                                    <Card.Text>{firstComment.content}</Card.Text>
                                </Card.Body>
                            </Card>
                        )}
                        {remainingComments.map((comment, index) => (
                            <Comment key={index} comment={comment} />
                        ))}
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                        <Form className="mt-3">
                            <Form.Group controlId="newComment">
                                <Form.Label>Add a Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter your comment"
                                    value={newComment}
                                    onChange={handleCommentChange}
                                />
                            </Form.Group>
                            <Button className="mt-2" onClick={handleAddComment}>Add Comment</Button>
                        </Form>
                        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
                    </Card.Body>
                </Card>

            </div>
        </Container>
    );
};

export default PostScreen;
