"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import "./page.css";

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState([]);

  const [title, setTitle] = useState("");
  const [imageDesktop, setImageDesktop] = useState(null);
  const [imageMobile, setImageMobile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const desktopRef = useRef();
  const mobileRef = useRef();

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

    if (!imageDesktop) {
      alert("Vui lòng chọn ảnh desktop");
      return;
    }

    try {
      setUploading(true);

      const cleanName = (file) =>
        file.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");

      const uid = Math.random().toString(36).slice(2, 8);

      const fileDesktop = `${Date.now()}-${uid}-desktop-${cleanName(imageDesktop)}`;
      const fileMobile = imageMobile
        ? `${Date.now()}-${uid}-mobile-${cleanName(imageMobile)}`
        : null;

      // ================= UPLOAD DESKTOP =================
      const { error: uploadDesktopError } = await supabase.storage
        .from("images_slider")
        .upload(fileDesktop, imageDesktop);

      if (uploadDesktopError) {
        alert(uploadDesktopError.message);
        return;
      }

      const { data: desktopUrl } = supabase.storage
        .from("images_slider")
        .getPublicUrl(fileDesktop);

      // ================= UPLOAD MOBILE =================
      let mobileUrl = null;

      if (imageMobile) {
        const { error: uploadMobileError } = await supabase.storage
          .from("images_slider")
          .upload(fileMobile, imageMobile);

        if (uploadMobileError) {
          alert(uploadMobileError.message);
          return;
        }

        const { data: mUrl } = supabase.storage
          .from("images_slider")
          .getPublicUrl(fileMobile);

        mobileUrl = mUrl.publicUrl;
      }

      // ================= INSERT DB =================
      const { error: insertError } = await supabase
        .from("sliders")
        .insert([
          {
            title,
            image_desktop: desktopUrl.publicUrl,
            image_mobile: mobileUrl,
            status: "published",
          },
        ]);

      if (insertError) {
        alert(insertError.message);
        return;
      }

      // RESET STATE
      setTitle("");
      setImageDesktop(null);
      setImageMobile(null);

      // RESET INPUT FILE
      if (desktopRef.current) desktopRef.current.value = "";
      if (mobileRef.current) mobileRef.current.value = "";

      fetchSliders();
      alert("Thêm slider thành công");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi upload slider");
    } finally {
      setUploading(false);
    }
  }

  // ================= DELETE =================
  async function handleDelete(id) {
    const confirmDelete = confirm("Xóa slider?");
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

  // ================= UI =================
  return (
    <main className="adminSliderPage">

      <h1>Quản lý Slider</h1>

      {/* FORM */}
      <form onSubmit={handleAddSlider} className="sliderForm">

        <input
          type="text"
          placeholder="Tiêu đề slider"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Ảnh Desktop (1920x800)</label>
        <input
          ref={desktopRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImageDesktop(e.target.files[0])}
        />

        <label>Ảnh Mobile (1080x1350)</label>
        <input
          ref={mobileRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImageMobile(e.target.files[0])}
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Đang upload..." : "Thêm Slider"}
        </button>
      </form>

      {/* LIST */}
      <div className="sliderList">

        {sliders.map((item) => (
          <div key={item.id} className="sliderCard">

            {/* PREVIEW DESKTOP */}
            <img
              src={item.image_desktop || item.image}
              alt={item.title}
            />

            {/* PREVIEW MOBILE (nhỏ) */}
            {item.image_mobile && (
              <img
                src={item.image_mobile}
                alt="mobile"
                style={{
                  width: 120,
                  height: 160,
                  objectFit: "cover",
                  marginTop: 8,
                  borderRadius: 8,
                  display: "block",
                }}
              />
            )}

            <div className="sliderBody">

              <h3>{item.title}</h3>

              <div className="sliderActions">
                <button
                  className="deleteBtn"
                  onClick={() => handleDelete(item.id)}
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