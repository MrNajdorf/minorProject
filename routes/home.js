const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../middleware')
const wrapAsync = require('../utils/wrapAsync')

const Post = require('../models/post');
const Thread = require('../models/thread');
const User = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
        res.json(posts)
    } catch (e) {
        res.send("Error fetching posts")
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) {
            res.send("Post not found")
            return
        }
        res.json(post)
    } catch (e) {
        res.send("Error fetching post")
    }
})


router.post('/', isLoggedIn, wrapAsync(async (req, res) => {
    try {
        const { content } = req.body
        const user = res.locals.currentUser
        const post = new Post(
            {
                content: content,
                creator: user._id,
                upvotes: 0,
                downvotes: 0,
            }
        )
        await post.save()
        res.send("Post created")
    } catch (e) {
        res.send("Error creating post")
    }
}))

router.post('/thread/:uid/:pid/:tid', isLoggedIn, async (req, res) => {
    try {
        const { uid, pid, tid } = req.params
        const { content } = req.body
        const user = res.locals.currentUser
        const prev_post = await Post.findById(pid);
        if (!prev_post) {
            res.send("Post not found")
        }
        const prev_thread = await Thread.findById(tid)
            .catch(async () => {
                const thread = new Thread(
                    {
                        creator: user._id,
                        post_id: pid,
                        content: content,
                        upvotes: 0,
                        downvotes: 0,
                    }
                )
                await thread.save()
                res.send("Thread created")
                return
            })

        const thread = new Thread(
            {
                creator: user._id,
                post_id: pid,
                thread_id: tid,
                content: content,
                upvotes: 0,
                downvotes: 0,
            }
        )
        await thread.save()
        res.send("Thread created")
    } catch (e) {
        console.log(e)
        res.send("Error creating thread")
    }
})

module.exports = router;
