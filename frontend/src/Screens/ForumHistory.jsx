import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../Components/PostComponet';
import { Link } from 'react-router-dom';

const UserPostHistoryPage = () => {
    const [posts, setPosts] = useState([]);
    const storedUsername = localStorage.getItem('username');

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
               
                const response = await axios.get(`/api/forum/posts/user/${storedUsername}`);
                console.log(response);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserPosts();
    }, []);

    return (
        <div>
            <h1>User Post History</h1>
            {posts.map(post => (
                <Link
                    to={`/post/${post._id}`}
                    key={post._id}
                    style={{ textDecoration: 'none', color: 'inherit' }} // Inline styles to remove underline and inherit color
                >
                    <Post post={post} />
                </Link>
            ))}
        </div>
    );
};

export default UserPostHistoryPage;
