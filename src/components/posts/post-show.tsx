import { db } from "@/db";
import { notFound } from "next/navigation";
import * as actions from '@/actions'

interface PostShowProps {
  postId: string;
}

export default async function PostShow({ postId }: PostShowProps) {

  const post = await db.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    notFound();
  }

  const deletePost = actions.deletePost.bind(null, post)

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold my-2">{post.title}</h1>
      <p className="p-4 border rounded">{post.content}</p>
      <form action={deletePost}>
        <button type='submit'>Delete</button>
      </form>
      <form action="">
        
      </form>
    </div>  

  );
}
