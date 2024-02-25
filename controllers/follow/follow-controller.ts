import {AuthRequest} from '../../middleware/auth';
import {Response} from 'express';
import {prisma} from '../../prisma/prisma-client';

export const follow = async (req: AuthRequest, res: Response) => {
	try {

		const {followingId} = req.body
		const userId = req.user.userId

		if (followingId !== userId) {
			return res.status(500).json({error: 'You cannot follow himself!'})
		}

		const existingSubscription = await prisma.follows.findFirst({
			where: {
				AND: [
					{followerId: userId},
					{followingId: followingId},
				],
			},
		})
		if (existingSubscription) {
			return res.status(400).json({message: 'Subscription already exist'});
		}

		await prisma.follows.create({
			data: {
				follower: {connect: {id: userId}},
				following: {connect: {id: followingId}},
			},
		});

		res.status(201).json({message: 'Subscription was create successful'});
	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}

export const unFollow = async (req: AuthRequest, res: Response) => {
	try {

		const {followingId} = req.body
		const userId = req.user.userId

		const follows = await prisma.follows.findFirst({
			where: {
				AND: [
					{followerId: userId},
					{followingId},
				],
			},
		})

		if (!follows) {
			return res.status(404).json({error: 'You dont\'t subscribe to this user'})
		}
		await prisma.follows.delete({
			where: {id: follows.id},
		});

		res.status(200).json({message: 'You successfully un subscribe to this user'});

	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}
