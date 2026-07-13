import type { MetadataRoute } from "next";
import { TRACKS } from "@/lib/curriculum/data";

const SITE_URL = "https://ai-academy-three-olive.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/tracks", "/dashboard", "/playground", "/mentor", "/auth/login", "/auth/signup"];

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
