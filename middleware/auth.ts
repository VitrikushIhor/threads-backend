import {NextFunction, Request, Response} from 'express'
import jsonwebtoken from 'jsonwebtoken';

export interface AuthRequest extends Request {
	user?: any;
}

export const authorizationToken = (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (!token) {
		return res.status(401).json({error: 'Unauthorized'})
	}

	jsonwebtoken.verify(token, `${process.env.SECRET_KEY}`, (error, user) => {

		if (error) {
			return res.status(403).json({error: 'Invalid Token'})
		}

		req.user = user

		next()
	})
}
