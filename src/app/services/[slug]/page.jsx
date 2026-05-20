import { supabase } from "@/lib/supabase";

export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) {
    return {
      title: "Không tìm thấy dịch vụ",
    };
  }

  return {
    title: data.meta_title || data.title,
    description:
      data.meta_description ||
      data.short_description,

    keywords: data.meta_keywords || "",

    alternates: {
      canonical: `https://testhisu.vercel.app/services/${data.slug}`,
    },

    openGraph: {
      title: data.meta_title || data.title,
      description:
        data.meta_description ||
        data.short_description,

      images: data.image
        ? [data.image]
        : [],
    },
  };
}

export default async function Page({
  params,
}) {
  const { slug } = params;

  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) {
    return (
      <div>
        ❌ Không tìm thấy dịch vụ
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{data.title}</h1>

      <p>{data.short_description}</p>

      {data.image && (
        <img
          src={data.image}
          alt={data.title}
          width="100%"
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