import type { AppLoadContext } from "@remix-run/server-runtime";

type Post = {
  slug: string;
  title: string;
};

export async function getPosts(ctx: AppLoadContext): Promise<Array<Post>> {
  const res = await ctx.env.CFDB.prepare("select * from posts").all();

  return res.results as Post[];
}
