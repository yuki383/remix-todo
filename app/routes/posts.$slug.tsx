import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import { getPost } from "../models/post.server";

export const loader = (async ({ params, context }) => {
  if (!params.slug) {
    throw new Error("params.slug is required");
  }

  const post = await getPost(context, params.slug);
  if (!post) {
    throw new Error(`Post not found: ${params.slug}`);
  }

  const html = marked(post.markdown);

  return json({
    post,
    html,
  });
}) satisfies LoaderFunction;

export default function PostSlug() {
  const { post, html } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Some Post: {post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
