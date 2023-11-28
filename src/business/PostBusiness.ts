import { PostDabatase } from '../database/PostDatabase';
import { CreatePostInputDTO } from '../dtos/posts/createPost.dto';
import { DeletePostInputDTO } from '../dtos/posts/deletePost.dto';
import { EditPostInputDTO } from '../dtos/posts/editPost.dto';
import {
	GetPostsInputDTO,
	GetPostsOutputDTO,
} from '../dtos/posts/getPosts.dto';
import { LikePostInputDTO } from '../dtos/posts/likePost.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { LikesDislikes } from '../models/LikeDislike';
import { Post, PostDB, PostDBGet } from '../models/Post';
import { PostLikeDB } from '../models/LikeDislike';
import { USER_ROLES } from '../models/User';
import { IdGenerator } from '../services/IdGenerator';
import { tokenManager } from '../services/TokenManager';

export class PostBusiness {
	constructor(
		private postDatabase: PostDabatase,
		private idGenerator: IdGenerator,
		private tokenManager: tokenManager
	) {}

	public getPosts = async (
		input: GetPostsInputDTO
	): Promise<GetPostsOutputDTO> => {
		const payload = await this.tokenManager.getPayload(input.token);

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const postsDB: PostDBGet[] = await this.postDatabase.getPosts();
		const posts = postsDB.map((postDB) => {
			const post = new Post(
				postDB.id,
				postDB.creator_id,
				postDB.content,
				postDB.likes,
				postDB.dislikes,
				postDB.created_at,
				postDB.updated_at
			);
			return post.toBusinessModel(postDB.name);
		});

		const output: GetPostsOutputDTO = posts;
		return output;
	};

	public createPost = async (input: CreatePostInputDTO): Promise<void> => {
		const { content, token } = input;

		const payload = await this.tokenManager.getPayload(token);
		const id = await this.idGenerator.generate();

		if (payload === null) {
			throw new BadRequestError('token inválido');
		}

		const newPost = new Post(
			id,
			payload.id,
			content,
			0,
			0,
			new Date().toISOString(),
			new Date().toISOString()
		);

		const newPostDB = newPost.toDBModel();
		await this.postDatabase.insertPost(newPostDB);
	};

	public editPost = async (input: EditPostInputDTO): Promise<void> => {
		const { id, token, content } = input;

		const payload = await this.tokenManager.getPayload(token);

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const post: PostDB = await this.postDatabase.getPostById(id);

		if (!post) {
			throw new NotFoundError('Post não encontrado');
		}

		if (payload.id !== post.creator_id) {
			throw new BadRequestError('Só quem criou o post pode editá-lo');
		}

		const newPost = new Post(
			post.id,
			post.creator_id,
			content,
			post.likes,
			post.dislikes,
			post.created_at,
			post.updated_at
		);

		await this.postDatabase.editPost(newPost.toDBModel());
	};

	public deletePost = async (input: DeletePostInputDTO): Promise<void> => {
		const { id, token } = input;

		const payload = await this.tokenManager.getPayload(token);

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const post: PostDB = await this.postDatabase.getPostById(id);

		if (!post) {
			throw new NotFoundError('Post não encontrado');
		}

		if (
			payload.id !== post.creator_id &&
			payload.role !== USER_ROLES.NORMAL
		) {
			throw new BadRequestError('Só quem criou o post pode deletá-lo');
		}

		await this.postDatabase.deletePost(id);
	};

	public likePost = async (input: LikePostInputDTO): Promise<void> => {
		const { id, token, like } = input;

		const payload = await this.tokenManager.getPayload(token);

		if (payload === null) {
			throw new BadRequestError('Token inválido');
		}

		const post: PostDB = await this.postDatabase.getPostById(id);

		if (!post) {
			throw new NotFoundError('Post não encontrado');
		}

		if (post.creator_id === payload.id) {
			throw new BadRequestError('Quem criou o post não pode dar like ou dislike no mesmo.')
		}

		const intLike = like ? 1 : 0;
		const checkLike: PostLikeDB = await this.postDatabase.getLikesById(
			payload.id,
			id
		);

		if (!checkLike) {
			const newLike = new LikesDislikes(payload.id, id, like);
			const newLikeDB = newLike.toDBModel();

			await this.postDatabase.insertLikeDislike(newLikeDB);
		} else if (checkLike.like === intLike) {
			await this.postDatabase.deleteLikeDislike(payload.id, id);
		} else {
			const newLike = new LikesDislikes(payload.id, id, like);
			const newLikeDB = newLike.toDBModel();

			await this.postDatabase.updateLikeDislike(newLikeDB);
		}
	};
}
