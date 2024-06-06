import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import FormattedDate from '../Components/FormattedDate';

const Post = ({ post }) => {
    const { title, category, username, createdAt, comments } = post;
    const lastComment = comments[comments.length - 1];

    return (
        <Card className="mb-3">
            <Card.Body>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Card.Title>{title}</Card.Title>
                    <div style={{ fontSize: '1rem', color: 'black' }}><FormattedDate date={createdAt} /></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Card.Subtitle className="mb-2 text-muted">Category: {category}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">Posted by: {username}</Card.Subtitle>
                </div>
                <hr />
                {lastComment ? (
                    <ListGroup variant="flush">
                        <ListGroup.Item>{lastComment.content}</ListGroup.Item>
                    </ListGroup>
                ) : (
                    <p>No comments yet</p>
                )}
            </Card.Body>
        </Card>
    );
};

export default Post;
