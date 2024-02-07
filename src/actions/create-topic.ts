"use server";

import { z } from "zod";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/[a-z-]/, {
      message: "Must be lowercase letter or dashed without spaces",
    }),
  description: z.string().min(10),
});

interface CreateTopicFomrState {
  errors: {
    name?: string[];
  };
}

export async function createTopic(formState: number, formData: FormData) {
  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!result.success) {
    console.log(result.error.flatten().fieldErrors);
  }
  // TODO: revalidate the homepage after creating a topic
}
