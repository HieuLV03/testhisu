import { supabase } from "@/lib/supabase";
export const revalidate = 3600;
export default async function sitemap() {
  // POSTS
  const { data: posts, error: postError } =
    await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");

  // SERVICES
  const {
    data: services,
    error: serviceError,
  } = await supabase
    .from("services")
    .select("slug, updated_at")
    .eq("status", "published");

  // ERROR
  if (postError || serviceError) {
    return [
      {
        url: "https://testhisu.vercel.app",
        lastModified: new Date(),
      },
    ];
  }

  // POSTS URLS
  const postUrls = posts.map((post) => ({
    url: `https://testhisu.vercel.app/posts/${post.slug}`,
    lastModified:
      post.updated_at || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // SERVICES URLS
  const serviceUrls = services.map(
    (service) => ({
      url: `https://testhisu.vercel.app/services/${service.slug}`,
      lastModified:
        service.updated_at || new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    })
  );

  return [
    {
      url: "https://testhisu.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: "https://testhisu.vercel.app/posts",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: "https://testhisu.vercel.app/services",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    ...postUrls,
    ...serviceUrls,
  ];
}