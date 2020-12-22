import { NextFunction, Request, Response } from 'express';
import md5 from 'md5';
import passport from 'passport';
import { Strategy } from 'passport-http-bearer';
import { Token } from './models/Token';

export function auth() {
	return [
		(_req: Request, _res: Response, next: NextFunction) => {
			passport.use(
				new Strategy(async (hash, done) => {
					try {
						const token = await Token.findOne({
							where: {
								hash: md5(hash),
							},
							relations: ['user'],
						});
						if (!token) {
							return done(null, false);
						}
						return done(null, token.user);
					} catch (error) {
						console.error(error);
						return done(error);
					}
				})
			);
			return next();
		},
		passport.authenticate('bearer', { session: false }),
	];
}
