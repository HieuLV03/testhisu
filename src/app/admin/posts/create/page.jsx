"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import "./page.css";

export default function CreatePostPage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    thumbnail: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_image: "",
    category: "",
    status: "published",
    featured: false,
  });

  // =========================
  // SLUG CLEAN
  // =========================
  const sanitize = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const randomString = () =>
    Math.random().toString(36).substring(2, 8);

  // =========================
  // UPLOAD IMAGE (SLUG NAME + images_post)
  // =========================
  const uploadImage = async (file, slug) => {
    const fileExt = file.name.split(".").pop();

    const cleanSlug = sanitize(slug || "post");

    const fileName = `${cleanSlug}-${Date.now()}-${randomString()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("images_post")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("images_post")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // =========================
  // CREATE POST
  // =========================
  const createPost = async () => {
    if (!form.title) return alert("Nhập tiêu đề");

    setLoading(true);

    try {
      let thumbnailUrl = "";

      if (file) {
        thumbnailUrl = await uploadImage(file, form.slug);
      }

      const { error } = await supabase.from("posts").insert([
        {
          title: form.title,
          slug: form.slug,
          description: form.description,
          content: form.content,

          thumbnail: thumbnailUrl,

          meta_title: form.meta_title,
          meta_description: form.meta_description,
          meta_keywords: form.meta_keywords,
          og_image: form.og_image,

          category: form.category,
          status: form.status,
          featured: form.featured,

          views: 0,
        },
      ]);

      if (error) throw error;

      alert("Tạo bài viết thành công!");

      setForm({
        title: "",
        slug: "",
        description: "",
        content: "",
        thumbnail: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_image: "",
        category: "",
        status: "published",
        featured: false,
      });

      setFile(null);
    } catch (err) {
      console.log(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createPostPage">
      <div className="createPostCard">
        <h1>Tạo bài viết</h1>

        {/* TITLE → AUTO SLUG */}
        <input
          placeholder="Title"
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

        {/* FILE */}
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

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
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
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          placeholder="Meta title"
          value={form.meta_title}
          onChange={(e) =>
            setForm({ ...form, meta_title: e.target.value })
          }
        />

        <input
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

        <input
          placeholder="OG image"
          value={form.og_image}
          onChange={(e) =>
            setForm({ ...form, og_image: e.target.value })
          }
        />

        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="visible">Hiện</option>
          <option value="hidden">Ẩn</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm({
                ...form,
                featured: e.target.checked,
              })
            }
          />
          Featured
        </label>

        <button onClick={createPost} disabled={loading}>
          {loading ? "Đang lưu..." : "Đăng bài"}
        </button>
      </div>
    </div>
  );
}