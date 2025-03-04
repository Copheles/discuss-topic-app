'use server';

import type { Post } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import paths from '@/paths'


const editPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10)
})

interface EditPostFormState {
  errors: {
    title?: string[],
    content?: string[],
    _form?: string[]
  }
}

export async function editPost(post: Post, formState: EditPostFormState, formData: FormData): Promise<EditPostFormState>{

  const session = await auth();

  if(!session || !session.user){
    return {
      errors: {
        _form: ['You must be signed in to do this']
      }
    }
  }

  if(session.user.id !== post.userId){
    return {
      errors: {
        _form: ['You are not authorized to do this']
      }
    }
  }

  const result = editPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content')
  })

  if(!result.success){
    return {
      errors: result.error.flatten().fieldErrors
    }
  }

  let updatedPost: Post

  try{
    updatedPost = await db.post.update({
      where: {
        id: post.id
      },
      data: {
        title: result.data.title,
        content: result.data.content,
      },
    })

  }catch(err: unknown){
    if(err instanceof Error){
      return {
        errors: {
          _form: [err.message]
        }
      }
    }else{
      return {
        errors: {
          _form: ['Failed to edit post']
        }
      }
    }
  }

  return {
    errors:{}
  }

}

