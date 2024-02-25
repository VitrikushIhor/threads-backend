import {Router} from 'express';
import {authorizationToken} from '../../middleware/auth';
import {createPost, deletePost, getAllPosts, getPostById} from '../../controllers/post/post-controller';
import {like, unLike} from '../../controllers/like/like-controller';
import {follow, unFollow} from '../../controllers/follow/follow-controller';


const followRouter = Router()


followRouter.post('/api/follow', authorizationToken, follow)
followRouter.delete('/api/unfollow/:id', authorizationToken, unFollow)

export default followRouter
