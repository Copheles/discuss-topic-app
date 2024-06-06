import type { Comment } from "@prisma/client";
import { cache } from 'react'
import { db } from "./../index";

export type CommentWithAuthor = Comment & {
  name: string | null;
  image: string | null;
};

export const fetchCommentsByPostId = cache((
  postId: string
): Promise<CommentWithAuthor[]> => {
  console.log('making a query')
  return db.comment.findMany({
    where: { postId },
    include: {
      user: { select: { name: true, image: true } },
    },
  });
})
