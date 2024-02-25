import {Router} from 'express';
import {authorizationToken} from '../../middleware/auth';
import {createComment, deleteComment} from '../../controllers/comment/comment-controller';

const commentsRouter = Router()

commentsRouter.post('/api/comments', authorizationToken, createComment)
commentsRouter.delete('/api/comments', authorizationToken, deleteComment)

export default commentsRouter
