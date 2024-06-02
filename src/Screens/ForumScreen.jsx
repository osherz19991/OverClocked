import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const ForumScreen = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
  });
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/forum/posts');
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreatePost = async () => {
    let errors = {};
    let hasErrors = false;

    if (!newPost.title) {
      errors.title = 'Title is required.';
      hasErrors = true;
    }
    if (!newPost.content) {
      errors.content = 'Content is required.';
      hasErrors = true;
    }

    setFieldErrors(errors);

    if (hasErrors) {
      return;
    }

    const username = localStorage.getItem('username');

    if (!username) {
      setMessage('User not logged in');
      return;
    }

    const postData = { ...newPost, username };

    try {
      const response = await axios.post('/api/forum/posts', postData);
      setMessage(response.data.message);
      setNewPost({ title: '', content: '' });
      setPosts(prevPosts => [response.data.post, ...prevPosts]);
    } catch (error) {
      console.error('Error creating post:', error);
      setMessage('Failed to create post');
    }
  };

  return (
    <Container>
      <h2 className="my-4 text-center">Forum</h2>
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header><h3>Create New Post</h3></Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter post title"
                    name="title"
                    value={newPost.title}
                    onChange={handleInputChange}
                    className={fieldErrors.title ? 'is-invalid' : ''}
                  />
                  {fieldErrors.title && <div className="invalid-feedback">{fieldErrors.title}</div>}
                </Form.Group>
                <Form.Group controlId="content" className="mt-3">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Enter post content"
                    name="content"
                    value={newPost.content}
                    onChange={handleInputChange}
                    className={fieldErrors.content ? 'is-invalid' : ''}
                  />
                  {fieldErrors.content && <div className="invalid-feedback">{fieldErrors.content}</div>}
                </Form.Group>
                <div className="text-center mt-4">
                  <Button variant="primary" onClick={handleCreatePost}>Create Post</Button>
                </div>
              </Form>
              {message && <Alert variant="info" className="mt-3">{message}</Alert>}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <h3>Recent Posts</h3>
          {posts.length > 0 ? (
            posts.map(post => (
              <Card key={post._id} className="mb-3">
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.content}</Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="info">No posts available.</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ForumScreen;
