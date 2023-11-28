import express from 'express';
import { PostBusiness } from '../business/PostBusiness';
import { PostController } from '../controller/PostController';
import { tokenManager } from '../services/TokenManager';
import { IdGenerator } from '../services/IdGenerator';
import { PostDabatase } from '../database/PostDatabase';

export const postRouter = express.Router();

const postController = new PostController(
	new PostBusiness(new PostDabatase(), new IdGenerator(), new tokenManager())
);

postRouter.post('/', postController.createPost);
postRouter.get('/', postController.getPosts);
postRouter.put('/:id', postController.editPost);
postRouter.delete('/:id', postController.deletePost);
postRouter.put('/:id/like', postController.likePost)
