import "@remix-run/server-runtime";

interface Env {
  CFDB: D1Database;
}

declare module "@remix-run/server-runtime" {
  interface AppLoadContext {
    env: Env;
  }
}
