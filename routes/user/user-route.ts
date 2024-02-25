import express from 'express';
import multer from 'multer'
import {currentUser, getUserById, login, register, updateUser} from '../../controllers/user/user-controller';
import {authorizationToken} from '../../middleware/auth';
import {uploads} from '../../config/storage';

const userRouter = express.Router();


userRouter.post('/api/register', register)
userRouter.post('/api/login', login)
userRouter.get('/api/currentUser', authorizationToken, currentUser)
userRouter.get('/api/users/:id', authorizationToken, getUserById)
userRouter.put('/api/users/:id', authorizationToken, uploads.single('avatar'), updateUser)


export default userRouter
