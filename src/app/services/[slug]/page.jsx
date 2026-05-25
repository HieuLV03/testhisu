import { supabase } from "@/lib/supabase";
import "./page.css";
import Image from "next/image";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton/BackButton";

// FIX CACHE
export const revalidate = 3600;
export async function generateStaticParams() {
  const { data } = await supabase
    .from("services")
    .select("slug")
    .eq("status", "published");

  return data.map((item) => ({
    slug: item.slug,
  }));
}
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
      <BackButton />

      <h1 className="title">
        {data.title}
      </h1>

  <p className="desc">
  {data.short_description}
</p>

{/* PRICE */}
{data.price && (
  <div className="priceBox">
    <span className="priceLabel">
      Giá dịch vụ
    </span>

    <div className="priceValue">
      {Number(data.price).toLocaleString("vi-VN")}

      <span className="currency">
        đ
      </span>
    </div>
  </div>
)}
<div className="detailImage">
  <Image
    src={data.image}
    alt={data.title}
    fill
    priority
    sizes="100vw"
    style={{
      objectFit: "cover",
    }}
  />
</div>

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