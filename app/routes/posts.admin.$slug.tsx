import {
  json,
  redirect,
  type LoaderFunction,
  type ActionFunction,
} from "@remix-run/cloudflare";
import { getPost, updatePost } from "../models/post.server";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";

export const loader = (async ({ params, context }) => {
  if (!params.slug) {
    throw new Error("params.slug is required");
  }

  const post = await getPost(context, params.slug);
  if (!post) {
    throw new Error(`Post not found: ${params.slug}`);
  }

  return json({
    post,
  });
}) satisfies LoaderFunction;

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

  await updatePost(context, { slug, title, markdown });

  return redirect("/posts/admin");
}) satisfies ActionFunction;

export default function AdminSlug() {
  const { post } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isUpdating = navigation.state === "submitting";

  return (
    <main>
      <h2>Edit Post: {post.title}</h2>
      <Form method="post">
        <input type="hidden" name="slug" value={post.slug} />
        <p>
          <label>
            Post Title:{" "}
            <input type="text" name="title" defaultValue={post.title} />
          </label>
        </p>
        <p>
          <label>
            Post Slug:{" "}
            <input type="text" name="slug" value={post.slug} disabled />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">Markdown: </label>
          <br />
          <textarea
            id="markdown"
            rows={20}
            defaultValue={post.markdown}
            name="markdown"
          />
        </p>
        <p>
          <button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </p>
      </Form>
    </main>
  );
}
