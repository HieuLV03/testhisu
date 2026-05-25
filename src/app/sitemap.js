import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function sitemap() {
  let posts = [];
  let services = [];

  try {
    const { data: p } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");

    const { data: s } = await supabase
      .from("services")
      .select("slug, updated_at")
      .eq("status", "published");

    posts = p || [];
    services = s || [];
  } catch (err) {
    console.log("sitemap error:", err);
  }

  const postUrls = posts.map((post) => ({
    url: `https://thammyvienhisu.online/posts/${post.slug}`,
    lastModified: post.updated_at || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const serviceUrls = services.map((service) => ({
    url: `https://thammyvienhisu.online/services/${service.slug}`,
    lastModified: service.updated_at || new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
    {
      url: "https://thammyvienhisu.online",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://thammyvienhisu.online/posts",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://thammyvienhisu.online/services",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...postUrls,
    ...serviceUrls,
  ];
}