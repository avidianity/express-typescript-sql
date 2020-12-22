import { Request, Response, Router } from 'express';
import { body, matchedData, validationResult } from 'express-validator';
import md5 from 'md5';
import { Hash, String, Validation } from '../helpers';
import { Token } from '../models/Token';
import { User } from '../models/User';

const router = Router();

router.post(
	'/register',
	[
		body('email').isEmail().bail().custom(Validation.unique(User, 'email')),
		body('password').isString().bail().isStrongPassword(),
	],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json(errors.array());
			}

			const { email, password } = matchedData(req, {
				locations: ['body'],
			});

			const user = await new User({
				email,
				password: Hash.make(password),
			}).save();

			const token = String.random(40);
			await new Token().fill({ hash: md5(token), user }).save();

			return res.json({ user, token });
		} catch (error) {
			console.error(error);
			return res.status(500).json(error);
		}
	}
);

router.post(
	'/login',
	[body('email').isEmail().bail(), body('password').isString()],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(422).json(errors.array());
			}

			const { email, password } = matchedData(req, {
				locations: ['body'],
			});

			const user = await User.findOne({
				where: {
					email,
				},
			});

			if (!user) {
				return res
					.status(404)
					.json({ message: 'Email does not exist.' });
			}

			if (!Hash.check(password, user.password)) {
				return res.status(403).json({ message: 'Wrong password.' });
			}

			const token = String.random(40);
			await new Token().fill({ hash: md5(token), user }).save();

			return res.json({ user, token });
		} catch (error) {
			console.error(error);
			return res.status(500).json(error);
		}
	}
);

export const auth = router;
