"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "./page.css";

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [sliders, setSliders] = useState([]);

  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  async function fetchHomeData() {
    setLoading(true);

    const { data: sliderData } = await supabase
      .from("sliders")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    const { data: serviceData } = await supabase
      .from("services")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    const { data: postData } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(3);

    setSliders(sliderData || []);
    setServices(serviceData || []);
    setPosts(postData || []);
    setLoading(false);
  }

  const visibleServices = services.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <main className="home">

      {/* HERO */}
      <section className="heroSlider">
        {sliders.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop={sliders.length > 1}
            speed={1000}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="heroSwiper"
          >
            {sliders.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="heroSlide">

                  <picture className="heroPicture">
                    <source
                      media="(max-width: 768px)"
                      srcSet={item.image_mobile}
                    />
                    <img
                      src={item.image_desktop || item.image}
                      alt={item.title}
                      className="heroImg"
                    />
                  </picture>

                  <div className="heroOverlay" />

                  <div className="heroContent">
                    <h1>{item.title}</h1>

                    <p>
                      Hệ thống thẩm mỹ & chăm sóc sắc đẹp chuyên nghiệp.
                    </p>

                    <div className="heroActions">
                      <Link href="/booking" className="btnPrimary">
                        Đặt lịch
                      </Link>
                 
                      <Link href="/posts" className="btnOutline">
                        Xem bài viết
                      </Link>
                    </div>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="sectionHeader">
          <h2>Dịch vụ nổi bật</h2>
        </div>

        {loading ? (
          <p className="loading">Đang tải...</p>
        ) : (
          <>
            <div className="serviceGrid">
              {visibleServices.map((s) => (
                <Link
                  key={s.id}
                  href={`/services/${s.slug}`}
                  className="serviceCard"
                >
                  <div className="serviceImg">
                    <img src={s.image} alt={s.title} />
                  </div>

                  <div className="serviceBody">
                    <h3>{s.title}</h3>
                    <span>
                      {Number(s.price || 0).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {visibleCount < services.length && (
              <div className="loadMoreWrap">
                <button onClick={loadMore} className="loadMoreBtn">
                  Xem thêm
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* BLOG */}
      <section className="section">
        <div className="sectionHeader">
          <h2>Bài viết mới</h2>
        </div>

        <div className="blogGrid">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/posts/${p.slug}`}
              className="blogCard"
            >
              <img src={p.image} alt={p.title} />

              <div className="blogBody">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}