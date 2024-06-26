"use server";

import { auth } from "@/auth";
import type { Topic } from '@prisma/client'
import { redirect } from "next/navigation";
import { db } from "@/db";
import paths from "@/paths";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/[a-z-]/, {
      message: "Must be lowercase letter or dashed without spaces",
    }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export async function createTopic(formState: CreateTopicFormState, formData: FormData): Promise<CreateTopicFormState> {

  
  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  const session = await auth()
  if(!session || !session.user){
    return {
      errors: {
        _form: ['You must be signed in to do this.']
      }
    }
  }

  if (!result.success) {
    console.log("errors", result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,// flatten().fieldErrors is from zod
    }
  }

  let topic: Topic;

  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description
      }
    })
  } catch (error: unknown) {
    if(error instanceof Error){
      return {
        errors: {
          _form: [error.message]
        }
      }
    }else{
      return {
        errors: {
          _form: ['Something went wrong']
        }
      }
    }
  }

  revalidatePath('/')
  redirect(paths.topicShow(topic.slug))
 
}
