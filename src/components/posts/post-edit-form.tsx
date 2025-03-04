"use client";

import { useFormState } from "react-dom";
import {
  Button,
  Input,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import * as actions from "@/actions";
import FormButton from "../common/form-button";

interface PostEditFormProps{
  postId: string
}

export default function PostEditForm({ postId }: PostEditFormProps) {
  const [formState, action] = useFormState(actions.editPost.bind(null, postId), {
    errors: {},
  });

  return (
    <Popover placement="left" backdrop="opaque">
      <PopoverTrigger>
        <Button color="primary">Edit a post</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Edit a Post</h3>
            <Input
              name="title"
              label="Title"
              labelPlacement="outside"
              placeholder="Title"
              isInvalid={!!formState.errors.title}
              errorMessage={formState.errors.title?.join(', ')}
            />
            <Textarea
              name="content"
              label="Content"
              labelPlacement="outside"
              placeholder="Content"
              isInvalid={!!formState.errors.content}
              errorMessage={formState.errors.content?.join(', ')}
            />
            {
              formState.errors._form ? <div className="rounded-xl p-2 bg-red-200 border border-red-400">{formState.errors._form?.join(', ')}</div> : null
            }
            <FormButton>Create Post</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
