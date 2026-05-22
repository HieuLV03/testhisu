import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton/BackButton";
import "./page.css"
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    title:
      data.meta_title ||
      data.title,

    description:
      data.meta_description ||
      data.description,

    alternates: {
      canonical: `https://testhisu.vercel.app/posts/${data.slug}`,
    },

    openGraph: {
      title:
        data.meta_title ||
        data.title,

      description:
        data.meta_description ||
        data.description,

      images: data.image
        ? [data.image]
        : [],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        data.meta_title ||
        data.title,

      description:
        data.meta_description ||
        data.description,

      images: data.image
        ? [data.image]
        : [],
    },
  };
}

export default async function PostPage({
  params,
}) {
  const { slug } = params;

  const { data, error } =
    await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq(
        "status",
        "published"
      )
      .single();

  if (error || !data) {
    return (
      <div>
        ❌ Không tìm thấy bài viết
      </div>
    );
  }

return (
  <div className="postPage">
    
    <BackButton />

    <div className="postContainer">

      <h1>{data.title}</h1>

      <p className="desc">
        {data.description}
      </p>

      {data.image && (
        <img
          className="postImage"
          src={data.image}
          alt={data.title}
        />
      )}

      <div
        className="content"
        dangerouslySetInnerHTML={{
          __html: data.content || "",
        }}
      />
    </div>
  </div>
);
}