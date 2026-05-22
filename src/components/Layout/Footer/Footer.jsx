"use client";

import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerContainer">

        {/* BRAND */}
        <div className="footerBrand">
          <h2>THẨM MỸ VIỆN HISU</h2>
          <p>
            Nâng tầm nhan sắc với công nghệ thẩm mỹ hiện đại, an toàn và tự nhiên.
          </p>
        </div>

        {/* LINKS */}
        <div className="footerLinks">
          <h3>Liên kết</h3>

          <Link href="/">Trang chủ</Link>
          <Link href="/services">Dịch vụ</Link>
          <Link href="/posts">Bài viết</Link>
          <Link href="/booking">Đặt lịch</Link>
        </div>

        {/* CONTACT */}
        <div className="footerContact">
          <h3>Liên hệ</h3>

          <p>📞 0372 089 821</p>
          <p>📧 thammyvienhisu@gmail.com</p>

          <div className="footerAddress">
            <p>
              <strong>🏢 Trụ sở:</strong> 354/47 Quốc lộ 1, P. Bình Tân, TP.HCM
            </p>
            <p>
              <strong>🏥 Cơ sở:</strong> 15A Sông Đà, P. Tân Sơn Hòa, TP.HCM
            </p>
          </div>

          <div className="social">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
          </div>
        </div>

      </div>

      <div className="footerBottom">
        © {new Date().getFullYear()} HISU. All rights reserved.
      </div>
    </footer>
  );
}