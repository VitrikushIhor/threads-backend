import {Router} from 'express';
import {authorizationToken} from '../../middleware/auth';
import {createPost, deletePost, getAllPosts, getPostById} from '../../controllers/post/post-controller';


const postRouter = Router()


postRouter.post('/api/posts', authorizationToken, createPost)
postRouter.get('/api/posts', authorizationToken, getAllPosts)
postRouter.get('/api/posts/:id', authorizationToken, getPostById)
postRouter.delete('/api/posts/:id', authorizationToken, deletePost)

export default postRouter
