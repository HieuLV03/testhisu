"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import "./page.css";

export default function CreateServicePage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    content: "",
    category: "",
    price: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: "published",
    is_featured: false,
  });

  // =========================
  // SEO SLUG / SANITIZE
const sanitize = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "") // chỉ giữ chữ + số
    .trim()
    .replace(/\s+/g, "-") // space → -
    .replace(/-+/g, "-"); // tránh ---
};
  const randomString = () =>
    Math.random().toString(36).substring(2, 8);

  // =========================
  // UPLOAD IMAGE (SEO NAME)
  // =========================
  const uploadImage = async (file, slug) => {
    const fileExt = file.name.split(".").pop();

    const cleanSlug = sanitize(slug || "service");

    const fileName = `${cleanSlug}-${Date.now()}-${randomString()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("images_service")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("images_service")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // =========================
  // CREATE SERVICE
  // =========================
  const createService = async () => {
    if (!form.title.trim()) {
      return alert("Nhập tên dịch vụ");
    }

    setLoading(true);

    try {
      let imageUrl = null;

      // upload image nếu có
      if (file) {
        imageUrl = await uploadImage(file, form.slug);
      }

      const { error } = await supabase.from("services").insert([
        {
          title: form.title,
          slug: form.slug,
          short_description: form.short_description,
          content: form.content,
          category: form.category,
          price: Number(form.price || 0),
          image: imageUrl,

          meta_title: form.meta_title,
          meta_description: form.meta_description,
          meta_keywords: form.meta_keywords,
          status: form.status,
          is_featured: form.is_featured,
        },
      ]);

      if (error) throw error;

      alert("Tạo dịch vụ thành công!");

      // reset form
      setForm({
        title: "",
        slug: "",
        short_description: "",
        content: "",
        category: "",
        price: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        status: "published",
        is_featured: false,
      });

      setFile(null);
    } catch (err) {
      console.log(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="createPostPage">
      <div className="createPostCard">
        <h1>Tạo dịch vụ</h1>

        {/* TITLE + AUTO SLUG */}
        <input
          placeholder="Tên dịch vụ"
          value={form.title}
          onChange={(e) => {
            const title = e.target.value;

            setForm({
              ...form,
              title,
              slug: sanitize(title),
            });
          }}
        />

        {/* FILE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0])}
        />

        {/* SLUG */}
        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({ ...form, slug: e.target.value })
          }
        />

        <input
          placeholder="Danh mục"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Giá"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <textarea
          placeholder="Mô tả ngắn"
          value={form.short_description}
          onChange={(e) =>
            setForm({
              ...form,
              short_description: e.target.value,
            })
          }
        />

<textarea
  className="editor"
  placeholder="Nhập HTML..."
  value={form.content}
  onChange={(e) =>
    setForm({
      ...form,
      content: e.target.value,
    })
  }
/>

        <input
          placeholder="Meta title"
          value={form.meta_title}
          onChange={(e) =>
            setForm({ ...form, meta_title: e.target.value })
          }
        />

        <textarea
          placeholder="Meta description"
          value={form.meta_description}
          onChange={(e) =>
            setForm({
              ...form,
              meta_description: e.target.value,
            })
          }
        />

        <input
          placeholder="Meta keywords"
          value={form.meta_keywords}
          onChange={(e) =>
            setForm({
              ...form,
              meta_keywords: e.target.value,
            })
          }
        />

        <label style={{ display: "flex", gap: 8 }}>
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) =>
              setForm({
                ...form,
                is_featured: e.target.checked,
              })
            }
          />
          Nổi bật
        </label>

        {/* BUTTON */}
        <button onClick={createService} disabled={loading}>
          {loading ? "Đang upload..." : "Tạo dịch vụ"}
        </button>
      </div>
    </div>
  );
}