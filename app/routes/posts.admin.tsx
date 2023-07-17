import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { getPosts } from "../models/post.server";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

export const loader = (async ({ context }) => {
  return json({ posts: await getPosts(context) });
}) satisfies LoaderFunction;

export default function PostAdmin() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Blog Admin</h1>
      <div>
        <nav>
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link to={post.slug}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
