"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./page.css";

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const editorRef = useRef(null);

  const [uploading, setUploading] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [content, setContent] =
    useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    category: "",
    price: "",
    image: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: "published",
    is_featured: false,
  });

  // =========================
  // SLUG
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
    Math.random()
      .toString(36)
      .substring(2, 8);

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const { data, error } =
        await supabase
          .from("services")
          .select("*")
          .eq("id", id)
          .maybeSingle();

      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          short_description:
            data.short_description ||
            "",

          category:
            data.category || "",

          price: data.price || "",

          image: data.image || "",

          meta_title:
            data.meta_title || "",

          meta_description:
            data.meta_description ||
            "",

          meta_keywords:
            data.meta_keywords ||
            "",

          status:
            data.status ||
            "published",

          is_featured:
            data.is_featured ||
            false,
        });

        setContent(
          data.content || ""
        );
      }
    };

    fetchData();
  }, [id]);

  // =========================
  // UPLOAD IMAGE
  // =========================

  const handleUploadImage =
    async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      try {
        setUploading(true);

        const fileExt =
          file.name
            .split(".")
            .pop();

        const fileName = `${
          form.slug || "service"
        }-${Date.now()}-${randomString()}.${fileExt}`;

        const { error } =
          await supabase.storage
            .from(
              "images_service"
            )
            .upload(
              fileName,
              file
            );

        if (error) {
          console.log(error);
          alert(
            "Upload ảnh thất bại"
          );
          return;
        }

        const { data } =
          supabase.storage
            .from(
              "images_service"
            )
            .getPublicUrl(
              fileName
            );

        setForm((prev) => ({
          ...prev,
          image:
            data.publicUrl,
        }));
      } catch (err) {
        console.log(err);

        alert(
          "Upload ảnh thất bại"
        );
      } finally {
        setUploading(false);
      }
    };

  // =========================
  // UPDATE
  // =========================

  const update = async () => {
    try {
      setLoading(true);

      console.log(content);

      const { error } =
        await supabase
          .from("services")
          .update({
            title: form.title,

            slug: form.slug,

            short_description:
              form.short_description,

            // HTML CONTENT
            content: content,

            category:
              form.category,

            price: Number(
              form.price || 0
            ),

            image: form.image,

            meta_title:
              form.meta_title,

            meta_description:
              form.meta_description,

            meta_keywords:
              form.meta_keywords,

            status:
              form.status,

            is_featured:
              form.is_featured,

            updated_at:
              new Date().toISOString(),
          })
          .eq("id", id);

      if (error) {
        console.log(error);

        alert(error.message);

        return;
      }

      alert(
        "Cập nhật thành công!"
      );

      router.refresh();
    } catch (err) {
      console.log(err);

      alert("Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="editServicePage">
      <div className="editServiceCard">
        <h1>Sửa dịch vụ</h1>

        {/* TITLE */}

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => {
            const title =
              e.target.value;

            setForm({
              ...form,
              title,
              slug:
                sanitize(
                  title
                ),
            });
          }}
        />

        {/* SLUG */}

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug:
                sanitize(
                  e.target.value
                ),
            })
          }
        />

        {/* CATEGORY */}

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category:
                e.target.value,
            })
          }
        />

        {/* PRICE */}

        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price:
                e.target.value,
            })
          }
        />

        {/* IMAGE */}

        <div className="uploadBox">
          <input
            type="file"
            onChange={
              handleUploadImage
            }
          />

          {uploading && (
            <p>
              Đang upload...
            </p>
          )}

          {form.image && (
            <img
              src={form.image}
              alt=""
              className="previewImage"
            />
          )}
        </div>

        {/* SHORT DESCRIPTION */}

        <textarea
          placeholder="Short description"
          value={
            form.short_description
          }
          onChange={(e) =>
            setForm({
              ...form,
              short_description:
                e.target.value,
            })
          }
        />

        {/* HTML EDITOR */}

       {/* HTML EDITOR */}

<textarea
  className="editor"
  value={content}
  onChange={(e) =>
    setContent(e.target.value)
  }
/>

        {/* META */}

        <input
          placeholder="Meta title"
          value={
            form.meta_title
          }
          onChange={(e) =>
            setForm({
              ...form,
              meta_title:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Meta description"
          value={
            form.meta_description
          }
          onChange={(e) =>
            setForm({
              ...form,
              meta_description:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Meta keywords"
          value={
            form.meta_keywords
          }
          onChange={(e) =>
            setForm({
              ...form,
              meta_keywords:
                e.target.value,
            })
          }
        />

        {/* STATUS */}

        <select
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status:
                e.target.value,
            })
          }
        >
          <option value="published">
            Hiển thị
          </option>

          <option value="hidden">
            Ẩn
          </option>
        </select>

        {/* FEATURED */}

        <label className="checkbox">
          <input
            type="checkbox"
            checked={
              form.is_featured
            }
            onChange={(e) =>
              setForm({
                ...form,
                is_featured:
                  e.target.checked,
              })
            }
          />

          Featured
        </label>

        {/* BUTTON */}

        <button
          onClick={update}
          disabled={loading}
        >
          {loading
            ? "Đang lưu..."
            : "Cập nhật"}
        </button>
      </div>
    </div>
  );
}