import {Request, Response} from 'express'
import {AuthRequest} from '../../middleware/auth';
import {prisma} from '../../prisma/prisma-client';

export const createPost = async (req: AuthRequest, res: Response) => {
	try {
		const {content} = req.body
		const authorId = req.user.userId

		if (!content) {
			return res.status(400).json({error: 'Fill all fields'})
		}
		const post = await prisma.post.create({
			data: {
				content,
				authorId,
			},
		})
		res.json(post)
	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}

export const getAllPosts = async (req: AuthRequest, res: Response) => {
	try {

		const userId = req.user.userId

		const posts = await prisma.post.findMany({
			include: {
				likes: true,
				author: true,
				comments: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		const postsWithLikeInfo = posts.map(post => ({
			...post,
			likedByUser: post.likes.some(like => like.userId === userId),
		}));

		res.json(postsWithLikeInfo);
	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}

export const getPostById = async (req: AuthRequest, res: Response) => {
	try {
		const {id} = req.params;
		const userId = req.user.userId;

		const post = await prisma.post.findUnique({
			where: {id},
			include: {
				comments: {
					include: {
						user: true,
					},
				},
				likes: true,
				author: true,
			},
		});

		if (!post) {
			return res.status(404).json({error: 'Post cannot be find!'});
		}

		const postWithLikeInfo = {
			...post,
			likedByUser: post.likes.some(like => like.userId === userId),
		};

		res.json(postWithLikeInfo);
	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}

export const deletePost = async (req: AuthRequest, res: Response) => {
	try {

		const {id} = req.params
		const post = await prisma.post.findUnique({where: {id}})
		if (!post) {
			return res.status(404).json({error: 'No post found!'})
		}
		if (post.authorId !== req.user.userId) {
			return res.status(403).json({error: 'Not Access'})
		}
		const transaction = await prisma.$transaction([
			prisma.comment.deleteMany({where: {postId: id}}),
			prisma.like.deleteMany({where: {postId: id}}),
			prisma.post.delete({where: {id}}),
		]);

		res.json(transaction);
	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}
