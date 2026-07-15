import type { MetadataRoute } from "next";
import { TRACKS } from "@/lib/curriculum/data";

const SITE_URL = "https://ai-academy-three-olive.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // רק דפים ציבוריים ואינדקסביליים — לא כוללים /dashboard ו-/auth/* שחסומים ב-robots
  const staticPages = ["", "/tracks", "/skills", "/graduation", "/atlasdesk", "/playground", "/mentor"];

  const lessonPages = TRACKS.flatMap((track) =>
    track.modules.flatMap((module) =>
      module.lessons.map(
        (lesson) => `/tracks/${track.slug}/${module.slug}/${lesson.slug}`
      )
    )
  );

  const trackPages = TRACKS.map((track) => `/tracks/${track.slug}`);

  return [...staticPages, ...trackPages, ...lessonPages].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
  }));
}
