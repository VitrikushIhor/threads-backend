import {Response} from 'express'
import {AuthRequest} from '../../middleware/auth';
import {prisma} from '../../prisma/prisma-client';

export const createComment = async (req: AuthRequest, res: Response) => {
	try {
		const {postId, content} = req.body
		const userId = req.body.userId

		if (!postId || !content) {
			return res.status(400).json({error: 'All fill required!'})
		}

		const comment = await prisma.comment.create({
			data: {
				postId,
				userId,
				content,
			},
		})
		res.json(comment)
	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}

export const deleteComment = async (req: AuthRequest, res: Response) => {
	try {
		const {id} = req.params
		const userId = req.user.userId
		const comment = await prisma.comment.findUnique({where: {id}})
		if (!comment) {
			return res.status(404).json({error: 'Comment not found'})
		}
		if (comment.userId !== userId) {
			return res.status(403).json({error: 'You don`t have access!'})
		}
		await prisma.comment.delete({where: {id}})
		res.json(comment)

	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}
