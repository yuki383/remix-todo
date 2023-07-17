import { Form, useActionData, useNavigation } from "@remix-run/react";
import { redirect, type ActionFunction, json } from "@remix-run/cloudflare";
import { createPost } from "../models/post.server";

export const action = (async ({ request, context }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((error) => error !== null);
  if (hasErrors) {
    return json(errors);
  }

  if (typeof title !== "string") {
    throw new Error("title must be a string");
  }
  if (typeof slug !== "string") {
    throw new Error("slug must be a string");
  }
  if (typeof markdown !== "string") {
    throw new Error("markdown must be a string");
  }

  await createPost(context, { title, slug, markdown });

  return redirect("/posts/admin");
}) satisfies ActionFunction;

export default function NewPost() {
  const errors = useActionData<typeof action>();

  const navigation = useNavigation();
  const isCreating = navigation.state === "submitting";

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title && <em>{errors.title}</em>}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug && <em>{errors.slug}</em>}
          <input type="text" name="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown: {errors?.markdown && <em>{errors.markdown}</em>}
        </label>
        <br />
        <textarea id="markdown" rows={20} name="markdown" />
      </p>
      <p>
        <button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
