import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

const router = express.Router();
const postsCollectionName = 'posts';
const usersCollectionName = 'accounts';

// GET /api/forum/posts - Fetch all posts with pagination and search
router.get('/posts', async (req, res) => {
  try {
    const db = await getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || '';

    const filter = searchQuery ? { $text: { $search: searchQuery } } : {};
    const posts = await db.collection(postsCollectionName)
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await db.collection(postsCollectionName).countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({ posts, totalPages });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/forum/posts - Create a new post
router.post('/postCreate', async (req, res) => {
  try {
    const { title, category, username,comments } = req.body;
    const db = await getDB();
    const newPost = {
      title,
      category,
      username,
      createdAt: new Date(),
      comments,
    };

    const result = await db.collection(postsCollectionName).insertOne(newPost);
    res.status(201).json({ message: 'Post created successfully', post: result[0] });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/forum/posts/:id - Fetch a single post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const db = await getDB();
    const post = await db.collection(postsCollectionName).findOne({ _id: new ObjectId(req.params.id) });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/forum/posts/:id/comments - Add a comment to a post
router.post('/posts/:id/createComment', async (req, res) => {
  try {
    const db = await getDB();
    const postId = req.params.id;
    const { username, content } = req.body;
    const newComment = {
      _id: new ObjectId(),
      username,
      content: content,
      createdAt: new Date(),
    };

    const result = await db.collection(postsCollectionName).findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $push: { comments: newComment } },
      { returnOriginal: false }
    );
   
    if (!result) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Update user's comments list
    const user = await db.collection(usersCollectionName).findOne({ username });
    if (user) {
      const userComment = { postId: postId, comment: newComment };
      if (user.comments) {
        user.comments.push(userComment);
      } else {
        user.comments = [userComment];
      }
      await db.collection(usersCollectionName).updateOne(
        { username },
        { $set: { comments: user.comments } }
      );
    }
    res.json(result);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/forum/posts/:id/comments - Get comments for a specific post
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const db = await getDB();
    const post = await db.collection(postsCollectionName).findOne({ _id: new ObjectId(req.params.id) });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post.comments || []);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/posts/user/:username', async (req, res) => {
  try {
    const db = await getDB();
    const username = req.params.username;
    const userPosts = await db.collection(postsCollectionName).find({ username }).toArray();
    res.json(userPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
