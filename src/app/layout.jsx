import "./globals.css";
import Header from "@/components/Layout/Header/Header";

export const metadata = {
  title: "THẨM MỸ VIỆN HISU",
  description: "Thẩm mỹ công nghệ cao",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="appBody">

        {/* HEADER */}
        <Header />

        {/* PAGE CONTENT */}
        <main className="mainContent">
          {children}
        </main>

      </body>
    </html>
  );
}