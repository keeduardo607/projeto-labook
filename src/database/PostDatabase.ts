import { PostDB, PostDBGet } from '../models/Post';
import { PostLikeDB } from '../models/LikeDislike';
import { BaseDataBase } from './BaseDatabase';

export class PostDabatase extends BaseDataBase {
	public static TABLE_POSTS = 'posts';
	public static TABLE_LIKES_DISLIKES = 'likes_dislikes';

	public async getPosts(): Promise<PostDBGet[]> {
		const result: PostDBGet[] = await BaseDataBase.connection(
			PostDabatase.TABLE_POSTS
		)
			.select(
				'posts.id',
				'posts.creator_id',
				'posts.content',
				'posts.created_at',
				'posts.updated_at',
				'users.name',
				BaseDataBase.connection
					.count('likes_dislikes.like as likes')
					.from('likes_dislikes')
					.whereRaw(
						'likes_dislikes.post_id = posts.id and likes_dislikes.like = 1'
					)
					.as('likes'),
				BaseDataBase.connection
					.count('likes_dislikes.like as dislikes')
					.from('likes_dislikes')
					.whereRaw(
						'likes_dislikes.post_id = posts.id and likes_dislikes.like = 0'
					)
					.as('dislikes')
			)
			.innerJoin('users', 'posts.creator_id', '=', 'users.id')
			.leftJoin(
				'likes_dislikes',
				'posts.id',
				'=',
				'likes_dislikes.post_id'
			)
			.groupBy('posts.id');
		return result;
	}

	public async insertPost(newPostDB: PostDB): Promise<void> {
		await BaseDataBase.connection(PostDabatase.TABLE_POSTS).insert(
			newPostDB
		);
	}

	public async getPostById(id: string): Promise<PostDB> {
		const [post]: PostDB[] = await BaseDataBase.connection(
			PostDabatase.TABLE_POSTS
		).where({ id });
		return post;
	}

	public async editPost(post: PostDB): Promise<void> {
		await BaseDataBase.connection(PostDabatase.TABLE_POSTS)
			.update(post)
			.where({ id: post.id });
	}

	public async deletePost(id: string): Promise<void> {
		await BaseDataBase.connection(PostDabatase.TABLE_POSTS)
			.del()
			.where({ id });
	}

	public async getLikesById(
		userId: string,
		postId: string
	): Promise<PostLikeDB> {
		const [likes] = await BaseDataBase.connection(
			PostDabatase.TABLE_LIKES_DISLIKES
		)
			.where('user_id', '=', userId)
			.andWhere('post_id', '=', postId);
		return likes;
	}

	public async insertLikeDislike(newPostLike: PostLikeDB): Promise<void> {
		await BaseDataBase.connection(PostDabatase.TABLE_LIKES_DISLIKES).insert(
			newPostLike
		);
	}

	public async deleteLikeDislike(
		userId: string,
		postId: string
	): Promise<void> {
		await BaseDataBase.connection(PostDabatase.TABLE_LIKES_DISLIKES)
			.del()
			.where('user_id', '=', userId)
			.andWhere('post_id', '=', postId);
	}

	public async updateLikeDislike(postLikeDB: PostLikeDB): Promise<void> {
		await BaseDataBase.connection(PostDabatase.TABLE_LIKES_DISLIKES)
			.update(postLikeDB)
			.where('user_id', '=', postLikeDB.user_id)
			.andWhere('post_id', '=', postLikeDB.post_id);
	}
}
