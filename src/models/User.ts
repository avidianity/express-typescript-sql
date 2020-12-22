import { Column, Entity, OneToMany } from 'typeorm';
import { Model } from './Model';
import { Token } from './Token';

@Entity()
export class User extends Model {
	protected fillable = ['email', 'password'];
	protected hidden = ['password'];

	@Column()
	email: string;

	@Column()
	password: string;

	@OneToMany(() => Token, (token) => token.user)
	tokens: Array<Token>;
}
