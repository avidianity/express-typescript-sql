import { hashSync, compareSync } from 'bcrypt';
import { Model } from './models/Model';

export namespace String {
	export function random(length = 20) {
		const characters =
			'1234567890qwertyuiopasdfghjklmznxbcvQWPEORITUYLAKSJDHFGMZNXBCV';
		let result = '';
		for (let x = 0; x < length; x++) {
			result += characters.charAt(
				Math.floor(Math.random() * characters.length)
			);
		}
		return result;
	}

	export function ucfirst(string: string) {
		const array = string.split('');
		array[0] = array[0].toUpperCase();
		return array.join('');
	}

	export function ucwords(string: string) {
		return string
			.split(' ')
			.map((word) => ucfirst(word))
			.join(' ');
	}
}

export namespace Validation {
	export function unique<T extends Model, K extends keyof T>(
		model: { new (): T },
		key: K,
		message?: string
	) {
		const Model: any = model;
		return async (value: any) => {
			try {
				const exists = await Model.findOne({
					where: {
						[key]: value,
					},
				});
				if (exists) {
					return Promise.reject(
						message
							? message
							: `${String.ucfirst(
									key as string
							  )} is already taken.`
					);
				}
				return true;
			} catch (error) {
				console.error(error);
				return Promise.reject(`Unable to verify ${key}.`);
			}
		};
	}
}

export namespace Hash {
	export function make(data: any) {
		return hashSync(data, 8);
	}

	export function check(data: any, hashed: string) {
		return compareSync(data, hashed);
	}
}
