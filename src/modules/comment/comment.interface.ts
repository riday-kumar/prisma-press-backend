export interface ICommentPostPayLoad {
  content: string;
  postId: string;
  authorId: string;
}

export interface ICommentUpdatePayLoad {
  content?: string;
}
