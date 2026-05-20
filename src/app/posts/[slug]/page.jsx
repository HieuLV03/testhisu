import { supabase } from "@/lib/supabase";

export async function generateMetadata({
  params,
}) {
  const { slug } = params;

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) {
    return {
      title: "Không tìm thấy bài viết",
    };
  }

  return {
    title: data.meta_title || data.title,

    description:
      data.meta_description ||
      data.description,

    keywords: data.meta_keywords || "",

    alternates: {
      canonical: `https://testhisu.vercel.app/posts/${data.slug}`,
    },

    openGraph: {
      title:
        data.meta_title || data.title,

      description:
        data.meta_description ||
        data.description,

      images: data.thumbnail
        ? [data.thumbnail]
        : [],
    },
  };
}

export default async function PostPage({
  params,
}) {
  const { slug } = params;

  if (!slug) {
    return <div>❌ Không có slug</div>;
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return (
      <div>
        ❌ Không tìm thấy bài viết
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 800,
        margin: "auto",
      }}
    >
      <h1>{data.title}</h1>

      <p style={{ color: "#666" }}>
        {data.description}
      </p>

      {data.thumbnail && (
        <img
          src={data.thumbnail}
          alt={data.title}
          style={{
            width: "100%",
            borderRadius: 12,
            margin: "20px 0",
          }}
        />
      )}

      <div
        dangerouslySetInnerHTML={{
          __html: data.content,
        }}
      />
    </div>
  );
}