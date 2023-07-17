import type { AppLoadContext } from "@remix-run/server-runtime";

type Post = {
  slug: string;
  title: string;
  markdown: string;
};

export async function getPosts(ctx: AppLoadContext): Promise<Array<Post>> {
  const res = await ctx.env.CFDB.prepare("select * from posts").all();

  return res.results as Post[];
}

export async function getPost(
  ctx: AppLoadContext,
  slug: string
): Promise<Post> {
  const result = await ctx.env.CFDB.prepare(
    "select * from posts where slug = ?"
  )
    .bind(slug)
    .first();

  return result as Post;
}

export async function createPost(ctx: AppLoadContext, post: Post) {
  await ctx.env.CFDB.prepare(
    "insert into posts (slug, title, markdown) values (?, ?, ?)"
  )
    .bind(post.slug, post.title, post.markdown)
    .run();
}
