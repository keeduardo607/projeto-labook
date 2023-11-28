import express from 'express';
import { UserController } from '../controller/UserController';
import { UserBusinnes } from '../business/UserBusiness';
import { IdGenerator } from '../services/IdGenerator';
import { tokenManager } from '../services/TokenManager';
import { UserDatabase } from '../database/UserDatabase';
import { HashManager } from '../services/HashManager';

export const userRouter = express.Router();

const userController = new UserController(
	new UserBusinnes(
		new UserDatabase(),
		new IdGenerator(),
		new tokenManager(),
		new HashManager()
	)
);

userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
