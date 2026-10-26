CREATE TABLE "site_settings" (
  "id" TEXT NOT NULL DEFAULT 'singleton',
  "linkedin_url" TEXT NOT NULL DEFAULT 'https://linkedin.com',
  "github_url" TEXT NOT NULL DEFAULT 'https://github.com',
  "email" TEXT NOT NULL DEFAULT 'hello@example.com',
  "cv_url" TEXT,
  "hero_greeting" TEXT NOT NULL DEFAULT 'Hi there, Bima Here',
  "hero_title" TEXT NOT NULL DEFAULT 'Building scalable digital solutions that empower & connect.',
  "hero_description" TEXT NOT NULL,
  "about_text" TEXT NOT NULL,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "site_settings" ("id", "hero_description", "about_text")
VALUES (
  'singleton',
  'I partner with forward-thinking companies to design and develop intuitive, high-performance web applications that turn complex problems into elegant user experiences.',
  'As a front-end developer, I''m a lowkey perfectionist when it comes to design. I like building things that look good and work even better. Coding''s my craft, but creativity''s what really keeps me going.'
);
