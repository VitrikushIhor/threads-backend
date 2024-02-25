import {Router} from 'express';
import {authorizationToken} from '../../middleware/auth';
import {createPost, deletePost, getAllPosts, getPostById} from '../../controllers/post/post-controller';
import {like, unLike} from '../../controllers/like/like-controller';


const likeRouter = Router()


likeRouter.post('/api/like', authorizationToken, like)
likeRouter.delete('/api/like/:id', authorizationToken, unLike)

export default likeRouter
