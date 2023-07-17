DROP TABLE IF EXISTS posts;

CREATE TABLE IF NOT EXISTS posts (
  slug VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  markdown TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_posts_updated_at AFTER UPDATE ON posts
BEGIN
  UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE slug = NEW.slug;
END;

INSERT INTO posts (slug, title, markdown) VALUES
  ('my-first-post', 'My First Post', 'Hello, this is my first post.');
INSERT INTO posts (slug, title, markdown) VALUES
  ('90s-mixtape', 'A Mixtape I Made Just For Yo', '# 90s Mixtape\n\n- I wish (Skee-Lo)\n- This Is How We Do It (Montell Jordan)');
