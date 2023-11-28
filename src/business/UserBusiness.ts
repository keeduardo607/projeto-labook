import { UserDatabase } from '../database/UserDatabase';
import { LoginInputDTO } from '../dtos/users/login.dto';
import { SignupInputDTO } from '../dtos/users/signup.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { TokenPayload, USER_ROLES, User } from '../models/User';
import { HashManager } from '../services/HashManager';
import { IdGenerator } from '../services/IdGenerator';
import { tokenManager } from '../services/TokenManager';

export class UserBusinnes {
	constructor(
		private userDatabase: UserDatabase,
		private idGenerator: IdGenerator,
		private tokenManager: tokenManager,
		private hashManager: HashManager
	) {}

	public signup = async (input: SignupInputDTO): Promise<string> => {
		const { name, email, password } = input;

		const hash = await this.hashManager.hash(password);
		const id: string = this.idGenerator.generate();

		const userIdExist = await this.userDatabase.findUserByID(id);
		const userEmailExist = await this.userDatabase.findUserByEmail(email);

		if (userIdExist) {
			throw new BadRequestError("O 'id' já existe");
		}
		if (userEmailExist) {
			//console.log('Teste');
			throw new BadRequestError("O 'email' já existe");
		}

		const newUser = new User(
			id,
			name,
			email,
			hash,
			USER_ROLES.NORMAL,
			new Date().toISOString()
		);
		const newUserDB = newUser.toDBModel();
		await this.userDatabase.insertUser(newUserDB);

		const TokenPayload: TokenPayload = {
			id: newUser.getId(),
			name: newUser.getName(),
			role: newUser.getRole(),
		};
		const token = this.tokenManager.createToken(TokenPayload);

		return token;
	};

	public login = async (input: LoginInputDTO): Promise<string> => {
		const { email, password } = input;
		const userDB = await this.userDatabase.findUserByEmail(email);

		if (!userDB) {
			throw new NotFoundError("'email' não encontrado");
		}

		const isPasswordCorrect = await this.hashManager.compare(
			password,
			userDB.password
		);

		if (!isPasswordCorrect) {
			throw new BadRequestError("'email' ou 'password' incorretos");
		}

		const user = new User(
			userDB.id,
			userDB.name,
			userDB.email,
			userDB.password,
			userDB.role,
			userDB.created_at
		);

		const TokenPayload: TokenPayload = {
			id: user.getId(),
			name: user.getName(),
			role: user.getRole(),
		};

		const token = await this.tokenManager.createToken(TokenPayload);

		return token;
	};
}
