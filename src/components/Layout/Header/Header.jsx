"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./Header.css";

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) {
        setProfile(null);
        setRole("guest");
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("name, role")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
      setRole(data?.role || "user");
      setLoading(false);
    };

    getUser();

    const { data: listener } =
      supabase.auth.onAuthStateChange(() => {
        getUser();
      });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return null;

  return (
    <>
      {/* ADMIN BAR */}
      {role === "admin" && (
        <div className="adminBar">
          <Link href="/admin/posts">➕ Bài viết</Link>
          <Link href="/admin/services">➕ Dịch vụ</Link>
            <Link href="/admin/sliders">
      ➕ Slider
    </Link>
        </div>
      )}

      {/* HEADER */}
      <header className="header">
        <div className="headerLeft">
          <Link href="/" className="logo">
            HISU
          </Link>
        </div>

        <button
          className="menuToggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <nav className={`nav ${menuOpen ? "active" : ""}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Trang chủ</Link>
          <Link href="/services" onClick={() => setMenuOpen(false)}>Dịch vụ</Link>
          <Link href="/posts" onClick={() => setMenuOpen(false)}>Bài viết</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>Giới thiệu</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Liên hệ</Link>
        </nav>

        <div className="headerRight">
          {!user && (
            <Link href="/auth" className="loginBtn">
              Đăng nhập
            </Link>
          )}

          {user && (
            <div className="userBox">
              <span>{profile?.name || user.email}</span>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}