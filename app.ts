import express from 'express';
import {createServer} from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv'
import type {Request, Response} from 'express';
import userRouter from './routes/user/user-route';
import postRouter from './routes/post/post-route';
import commentsRouter from './routes/comments/comments-route';
import likeRouter from './routes/like/like-route';
import followRouter from './routes/follow/follow-route';


dotenv.config()
const app = express();
const server = createServer(app);
const port = process.env.PORT || 5000

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// routes
app.use(userRouter)
app.use(postRouter)
app.use(commentsRouter)
app.use(likeRouter)
app.use(followRouter)

app.get('/', (req: Request, res: Response) => {
	res.status(200).json({
		message: 'Welcome to the API',
	});
});

server.listen(port, () => console.info(`Server running on port ${port}`));
