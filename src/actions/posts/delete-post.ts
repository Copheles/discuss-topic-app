'use server'

import { auth } from "@/auth";
import { db } from "@/db";
import type { Post } from "@prisma/client";
import paths from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePost(post: Post ) {
  const topic = await db.topic.findFirst({
    where: {
      id: post.topicId,
    },
  });

  if (!topic) {
    throw new Error("Not found topic");
  }
  try {
    const session = await auth();
    if (session?.user?.id === post?.userId) {
      await db.post.delete({
        where: {
          id: post.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }

  revalidatePath(paths.topicShow(topic.slug));
  redirect(paths.topicShow(topic.slug));
}
