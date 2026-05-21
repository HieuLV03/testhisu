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

    // SLIDER
    const { data: sliderData } = await supabase
      .from("sliders")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    // SERVICES
    const { data: serviceData } = await supabase
      .from("services")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    // POSTS
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

      {/* HERO SLIDER */}
      <section className="heroSlider">

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          className="heroSwiper"
        >

          {sliders.map((item) => (
            <SwiperSlide key={item.id}>

              <div
                className="heroSlide"
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              >

                <div className="heroOverlay" />

                <div className="heroContent">

                  <h1>{item.title}</h1>

                  <p>
                    Nâng tầm nhan sắc với công nghệ hiện đại
                  </p>

                  <div className="heroActions">

                    <Link href="/booking" className="btnPrimary">
                      Đặt lịch
                    </Link>

                    <Link href="/posts" className="btnOutline">
                      Bài viết
                    </Link>

                  </div>

                </div>

              </div>

            </SwiperSlide>
          ))}

        </Swiper>

      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="sectionHeader">
          <h2>Dịch vụ nổi bật</h2>
        </div>

        {loading ? (
          <p>Đang tải...</p>
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
                    {s.image && (
                      <img src={s.image} alt={s.title} />
                    )}
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
                <button
                  onClick={loadMore}
                  className="loadMoreBtn"
                >
                  Xem thêm
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* POSTS */}
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

              <img src={p.thumbnail} alt={p.title} />

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