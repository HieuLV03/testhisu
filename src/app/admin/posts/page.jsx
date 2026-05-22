"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import "./page.css";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH POSTS
  // =========================
  const fetchPosts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, created_at, status, image")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error.message);
      alert(error.message);
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // =========================
  // EXTRACT STORAGE PATH
  // =========================
const extractPath = (url) => {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    // lấy phần sau bucket name "posts"
    const parts = parsed.pathname.split("/images_post/");
    return parts[1] || null;
  } catch {
    return null;
  }
};

  // =========================
  // DELETE POST
  // =========================
  const deletePost = async (post) => {
    if (!post?.id) {
      alert("Missing post id");
      return;
    }

    const ok = confirm("Bạn có chắc muốn xoá bài viết này không?");
    if (!ok) return;

    try {
      // =========================
      // 1. DELETE IMAGE (STORAGE)
      // =========================
      if (post.image) {
        const filePath = extractPath(post.image);

        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from("images_post") // 👈 bucket name
            .remove([filePath]);

          if (storageError) {
            console.log("Storage error:", storageError.message);
          }
        }
      }

      // =========================
      // 2. DELETE DATABASE ROW
      // =========================
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);

      if (error) {
        alert(error.message);
        return;
      }

      // =========================
      // 3. UPDATE UI
      // =========================
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="adminPage">
      <div className="adminCard">

        {/* HEADER */}
        <div className="headerRow">
          <h1>Danh sách bài viết</h1>

          <Link href="/admin/posts/create" className="addBtn">
            + Thêm bài viết
          </Link>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p>Đang tải...</p>
        ) : posts.length === 0 ? (
          <p>Chưa có bài viết nào</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Slug</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.slug}</td>

                  <td>
                    {post.created_at
                      ? new Date(post.created_at).toLocaleDateString()
                      : ""}
                  </td>

                  <td>
                    <span className="status">{post.status}</span>
                  </td>

                  <td className="action">
                    <Link
                      href={`/admin/posts/edit/${post.id}`}
                      className="editBtn"
                    >
                      Sửa
                    </Link>

                    {/* IMPORTANT FIX */}
                    <button
                      onClick={() => deletePost(post)}
                      className="deleteBtn"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}