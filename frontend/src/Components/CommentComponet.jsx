import React from 'react';
import { Card } from 'react-bootstrap';
import FormattedDate from './FormattedDate';

const Comment = ({ comment }) => {

    return (
        <Card style={{ backgroundColor: '#B2FFF2', color: 'black' , minHeight: "200px"}} className="mb-3">
            <Card.Body>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Card.Title>Commented by: {comment.username}</Card.Title>
                    <div style={{ fontSize: '1rem', color: 'black' }}><FormattedDate date={comment.createdAt} /></div>
                </div>              
                <hr />
                <Card.Text>{comment.content}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Comment;
