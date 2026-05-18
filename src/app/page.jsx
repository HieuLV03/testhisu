"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./page.css";

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  async function fetchHomeData() {
    try {
      const { data: serviceData } = await supabase
        .from("services")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(6);

      const { data: postData } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(3);

      setServices(serviceData || []);
      setPosts(postData || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="homePage">

      {/* HERO */}
      <section className="hero">
        <div className="heroOverlay" />

        <div className="heroContent">
          <span className="heroBadge">THẨM MỸ VIỆN HISU </span>

          <h1>
            Nâng tầm nhan sắc<br />
            Chuẩn công nghệ hiện đại
          </h1>

          <p>Hệ thống thẩm mỹ & chăm sóc sắc đẹp chuyên nghiệp.</p>

          <div className="heroButtons">
            <Link href="/booking" className="btnPrimary">Đặt lịch ngay</Link>
            <Link href="/services" className="btnOutline">Xem dịch vụ</Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="sectionHeader">
          <span className="sectionTag">DỊCH VỤ</span>
          <h2>Dịch vụ nổi bật</h2>
        </div>

        {loading ? (
          <p className="loading">Đang tải...</p>
        ) : (
          <div className="serviceGrid">

            {services.map((item) => (
              <Link
                key={item.id}
                href={`/services/${item.slug}`}
                className="serviceCard"
              >

                <div className="serviceImg">
                  {item.image && (
                    <img src={item.image} alt={item.title} />
                  )}
                </div>

                <div className="serviceBody">
                  <h3>{item.title}</h3>
                  <p>{item.short_description}</p>
                  <span>
                    {Number(item.price || 0).toLocaleString("vi-VN")}đ
                  </span>
                </div>

              </Link>
            ))}

          </div>
        )}
      </section>

      {/* ABOUT */}
      <section className="aboutSection">
        <div>
          <h2>Về HISU</h2>
          <p>Thẩm mỹ công nghệ cao, an toàn & hiệu quả.</p>
        </div>

        <div>
          <img src="/images/about.jpg" alt="about" />
        </div>
      </section>

      {/* BLOG */}
      <section className="section">
        <div className="sectionHeader">
          <span className="sectionTag">BLOG</span>
          <h2>Bài viết mới</h2>
        </div>

        <div className="blogGrid">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`} className="blogCard">

              {post.thumbnail && (
                <div className="blogImg">
                  <img src={post.thumbnail} alt={post.title} />
                </div>
              )}

              <div className="blogBody">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>

            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}