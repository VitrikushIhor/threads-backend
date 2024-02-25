import {Response} from 'express'
import {AuthRequest} from '../../middleware/auth';
import {prisma} from '../../prisma/prisma-client';

export const like = async (req: AuthRequest, res: Response) => {
	try {
		const {postId} = req.body
		const userId = req.user.userId

		if (!postId) {
			return res.status(400).json({error: 'All fields are required'})
		}
		const existingLike = await prisma.like.findFirst({
			where: {postId, userId},
		});

		if (existingLike) {
			return res.status(400).json({error: 'You already liked this post!'});
		}
		const like = await prisma.like.create({
			data: {postId, userId},
		});

		res.json(like);
	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}

export const unLike = async (req: AuthRequest, res: Response) => {
	try {
		const {id} = req.params;
		const userId = req.user.userId;
		if (!id) {
			return res.status(400).json({error: 'You already have dislike'})
		}

		const existingLike = await prisma.like.findFirst({
			where: {postId: id, userId},
		})

		if (!existingLike) {
			return res.status(400).json({error: 'You already liked this post!'});
		}

		const like = await prisma.like.deleteMany({
			where: {postId: id, userId},
		});

		res.json(like);

	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}
