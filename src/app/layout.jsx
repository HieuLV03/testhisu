import "./globals.css";
import Header from "@/components/Layout/Header/Header";
import Footer from "@/components/Layout/Footer/Footer";

export const metadata = {
  title: "THẨM MỸ VIỆN HISU",
  description: "Thẩm mỹ công nghệ cao",

  verification: {
    google: "iMhkqfnYHYPZ2e7ZhvNa8URs0nteVRjtS03F9CKa0sU",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="appBody">
        <Header />
        <main className="mainContent">{children}</main>
        <Footer />
      </body>
    </html>
  );
}