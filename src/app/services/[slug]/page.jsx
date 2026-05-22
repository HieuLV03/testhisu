import { supabase } from "@/lib/supabase";
import "./page.css";
import { notFound } from "next/navigation";

// FIX CACHE
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    twitter: {
      card: "summary_large_image",

      title:
        data.meta_title ||
        data.title,

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

  const { data, error } =
    await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

  if (error || !data) {
    notFound();
  }

  return (
    <div className="page">
      <h1 className="title">
        {data.title}
      </h1>

      <p className="desc">
        {data.short_description}
      </p>

      {data.image && (
        <img
          className="image"
          src={data.image}
          alt={data.title}
        />
      )}

      <div
        className="content"
        dangerouslySetInnerHTML={{
          __html:
            data.content || "",
        }}
      />
    </div>
  );
}