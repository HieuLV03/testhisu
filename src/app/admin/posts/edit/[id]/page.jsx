"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./page.css";

export default function EditPostPage() {
  const params = useParams();
  const id = params?.id;

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    image: "",
    meta_title: "",
    meta_description: "",
    category: "",
    status: "hidden",
    featured: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // =========================
  // SLUG CLEANER
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
  // FETCH POST
  // =========================
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setForm(data);
    };

    fetchPost();
  }, [id]);

  // =========================
  // GET OLD PATH
  // =========================
  const getPathFromUrl = (url) => {
    if (!url) return null;

    const parts = url.split("images_post/");
    return parts.length > 1 ? parts[1] : null;
  };

  // =========================
  // UPLOAD IMAGE
  // =========================
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();

      const cleanSlug = sanitize(
        form.slug || form.title || "post"
      );

      const fileName = `${cleanSlug}-${Date.now()}-${randomString()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("images_post")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("images_post")
        .getPublicUrl(fileName);

      // DELETE OLD IMAGE
      if (form.image) {
        const oldPath = getPathFromUrl(form.image);

        if (oldPath) {
          await supabase.storage
            .from("images_post")
            .remove([oldPath]);
        }
      }

      setForm((prev) => ({
        ...prev,
        image: data.publicUrl,
      }));
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // UPDATE POST
  // =========================
const updatePost = async () => {
  try {
    setLoading(true);

    const { error } = await supabase
      .from("posts")
      .update({
        title: form.title,

        slug: form.slug,

        description: form.description,

        // LƯU HTML THẲNG
        content: form.content,

        image: form.image,

        meta_title: form.meta_title,

        meta_description:
          form.meta_description,

        category: form.category,

        status: form.status,

        featured: form.featured,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    alert("Cập nhật thành công!");
  } catch (err) {
    console.log(err);
    alert("Lỗi cập nhật");
  } finally {
    setLoading(false);
  }
};

  if (!mounted) return null;

  return (
    <div className="editPage">
      <div className="editCard">
        <h1>Sửa bài viết</h1>

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

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: sanitize(e.target.value),
            })
          }
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <textarea
          className="contentTextarea"
          placeholder="Content"
          value={form.content}
          onChange={(e) =>
            setForm({
              ...form,
              content: e.target.value,
            })
          }
        />

        {/* IMAGE */}
        <input type="file" onChange={handleUpload} />

        {uploading && <p>Đang upload...</p>}

        {form.image && (
          <img
            src={form.image}
            alt=""
            className="previewImage"
          />
        )}

        <input
          placeholder="Meta title"
          value={form.meta_title}
          onChange={(e) =>
            setForm({
              ...form,
              meta_title: e.target.value,
            })
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
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
        />

        <select
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value,
            })
          }
        >
          <option value="published">Hiển thị</option>
          <option value="hidden">Ẩn</option>
        </select>

        <label className="checkbox">
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

        <button
          onClick={updatePost}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Cập nhật"}
        </button>
      </div>
    </div>
  );
}