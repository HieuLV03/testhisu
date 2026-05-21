"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "./page.css";

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState([]);

  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSliders();
  }, []);

  // ================= FETCH =================

  async function fetchSliders() {
    const { data, error } = await supabase
      .from("sliders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setSliders(data || []);
  }

  // ================= ADD =================

  async function handleAddSlider(e) {
    e.preventDefault();

    if (!imageFile) {
      alert("Vui lòng chọn ảnh");
      return;
    }

    try {
      setUploading(true);

const cleanName = imageFile.name
  .replace(/\s+/g, "-")
  .replace(/[^\w.-]/g, "");

const fileName =
  `${Date.now()}-${cleanName}`;
      // ================= UPLOAD STORAGE =================

      const { error: uploadError } =
        await supabase.storage
          .from("images_slider")
          .upload(fileName, imageFile);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      // ================= GET PUBLIC URL =================

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("images_slider")
        .getPublicUrl(fileName);

      // ================= INSERT DATABASE =================

      const { error: insertError } =
        await supabase
          .from("sliders")
          .insert([
            {
              title,
              image: publicUrl,
              status: "published",
            },
          ]);

      if (insertError) {
        alert(insertError.message);
        return;
      }

      // RESET
      setTitle("");
      setImageFile(null);

      // REFRESH
      fetchSliders();

      alert("Thêm slider thành công");
    } finally {
      setUploading(false);
    }
  }

  // ================= DELETE =================

  async function handleDelete(id) {
    const confirmDelete =
      confirm("Xóa slider?");

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("sliders")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchSliders();
  }

  return (
    <main className="adminSliderPage">

      <h1>Quản lý Slider</h1>

      {/* FORM */}

      <form
        onSubmit={handleAddSlider}
        className="sliderForm"
      >

        <input
          type="text"
          placeholder="Tiêu đề slider"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImageFile(e.target.files[0])
          }
        />

        <button
          type="submit"
          disabled={uploading}
        >
          {uploading
            ? "Đang upload..."
            : "Thêm Slider"}
        </button>

      </form>

      {/* LIST */}

      <div className="sliderList">

        {sliders.map((item) => (
          <div
            key={item.id}
            className="sliderCard"
          >

            <img
              src={item.image}
              alt={item.title}
            />

            <div className="sliderBody">

              <h3>{item.title}</h3>

              <div className="sliderActions">

                <button
                  className="deleteBtn"
                  onClick={() =>
                    handleDelete(item.id)
                  }
                >
                  Xóa
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}