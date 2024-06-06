import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Post from '../Components/PostComponet';
import PaginationComponent from '../Components/PaginationComponet';

const ForumScreen = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    title: '',
    category: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;

  const navigate = useNavigate();

  const categories = [
    'CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'Power Supply', 'Case',
    'Cooling', 'Monitor', 'Keyboard', 'Mouse', 'Speakers', 'Networking',
    'Operating System', 'Software', 'Peripherals', 'Accessories', 'Build Guides',
    'Troubleshooting', 'General Discussion'
  ];

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
    if (!newPost.category) {
      errors.category = 'Category is required.';
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

    const postData = {
      title: newPost.title,
      category: newPost.category,
      username,
      comments: [{ content: newPost.content, username }],
    };

    try {
      const response = await axios.post('/api/forum/postCreate', postData);
      setMessage(response.data.message);
      setNewPost({ title: '', content: '', category: '' });
      setPosts(prevPosts => [response.data.post, ...prevPosts]);
      navigate(0);
    } catch (error) {
      console.error('Error creating post:', error);
      setMessage('Failed to create post');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <div className="w-100">
        <h2 className="my-4 text-center">Forum</h2>
        <Row className='justify-content-center'>
          <Col md={8} className="mb-4">
            <Card>
              <Card.Header className="bg-primary text-light"><h3>Create New Post</h3></Card.Header>
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
                  <Form.Group controlId="content">
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
                  <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      name="category"
                      value={newPost.category}
                      onChange={handleInputChange}
                      className={fieldErrors.category ? 'is-invalid' : ''}
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </Form.Control>
                    {fieldErrors.category && <div className="invalid-feedback">{fieldErrors.category}</div>}
                  </Form.Group>
                  <div className="text-center">
                    <Button variant="primary" onClick={handleCreatePost}>Create Post</Button>
                  </div>
                </Form>
                {message && <Alert variant="info" className="mt-3">{message}</Alert>}
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <h3 className="mb-3">Recent Posts</h3>
            {currentPosts && currentPosts.length > 0 ? (
              currentPosts.map(post => (
                post && post._id ? (
                  <Link
                    to={`/post/${post._id}`}
                    key={post._id}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Post post={post} />
                  </Link>
                ) : null
              ))
            ) : (
              <Alert variant="info">No posts available.</Alert>
            )}
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default ForumScreen;
