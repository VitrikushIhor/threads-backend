import {Request, Response} from 'express';
import {prisma} from '../../prisma/prisma-client';
import bcrypt from 'bcryptjs'
import jdenticon from 'jdenticon';
import path from 'path';
import * as fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import {AuthRequest} from '../../middleware/auth';
import cloudinary from '../../config/cloudnary'

export const register = async (req: Request, res: Response) => {
	try {
		const {email, password, name} = req.body

		if (!email || !password || !name) {
			return res.send(400).json({error: 'All fields must be filled!'})
		}

		const existingUser = await prisma.user.findUnique({where: {email}});

		if (existingUser) {
			return res.status(400).json({error: 'User already exists!'})
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const png = jdenticon.toPng(name, 200)
		const pngString = png.toString('base64');

		const cloudinaryResponse = await cloudinary.uploader.upload(`data:image/png;base64,${pngString}`, {
			folder: 'avatars', // Папка для збереження зображень в Cloudinary
			public_id: `${name}_${Date.now()}`, // Ідентифікатор зображення в Cloudinary
		});

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
				avatarUrl: cloudinaryResponse.url,
			},
		})


		res.json(user)
	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}

export const login = async (req: Request, res: Response) => {
	try {
		const {email, password} = req.body

		if (!email || !password) {
			return res.send(400).json({error: 'All fields must be filled!'})
		}

		const user = await prisma.user.findUnique({where: {email}})
		if (!user) {
			return res.send(400).json({error: 'Password or Email dosen\'t correct!'})
		}

		const passwordValid = await bcrypt.compare(password, user.password)
		if (!passwordValid) {
			return res.send(400).json({error: 'Password or Email dosen\'t correct!'})
		}

		const token = jsonwebtoken.sign(({userId: user.id}), `${process.env.SECRET_KEY}`)

		res.send({token})
	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}

export const getUserById = async (req: Request, res: Response) => {
	try {
		const {id} = req.params
		const userId = req.params.userId
		const user = await prisma.user.findUnique({
			where: {id},
			include: {
				followers: true,
				following: true,
			},
		})

		if (!user) {
			res.status(404).json({error: 'User not found!'})
		}
		const isFollowing = await prisma.follows.findFirst({
			where: {
				AND: [
					{followerId: userId},
					{followingId: id},
				],
			},
		})

		res.json({...user, isFollowing: Boolean(isFollowing)})
	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}

export const updateUser = async (req: AuthRequest, res: Response) => {
	try {
		const {id} = req.params
		const {email, name, dateOfBirth, bio, location} = req.body;

		let filePath

		if (req.file && req.file.path) {
			filePath = req.file.path
		}

		if (id !== req.user.userId) {
			return res.status(403).json({error: 'No Access'});
		}

		if (email) {
			const existingUser = await prisma.user.findFirst({
				where: {email},
			})

			if (existingUser && existingUser.id !== id) {
				return res.status(400).json({error: 'This email busy'})
			}
		}

		const user = await prisma.user.update({
			where: {id},
			data: {
				email: email || null,
				name: name || null,
				avatarUrl: filePath ? `/${filePath}` : null,
				dateOfBirth: dateOfBirth || null,
				bio: bio || null,
				location: location || null,
			},
		});
		res.json(user);

	} catch (e) {
		console.log(e)
		res.status(500).json({error: 'Internal Server Error'})
	}
}

export const currentUser = async (req: AuthRequest, res: Response) => {
	try {
		const user = await prisma.user.findUnique({
			where: {id: req.user.userId},
			include: {
				followers: {
					include: {
						follower: true,
					},
				},
				following: {
					include: {
						following: true,
					},
				},
			},
		});

		if (!user) {
			return res.status(400).json({error: 'Can\'t find User'});
		}

		return res.status(200).json(user)
	} catch (e) {

	}
}
