import { Column, Entity, ManyToOne } from 'typeorm';
import { Model } from './Model';
import { User } from './User';

@Entity()
export class Token extends Model {
	@Column()
	hash: string;

	@Column()
	lastUsed: Date;

	@ManyToOne(() => User, (user) => user.tokens)
	user: User;
}
