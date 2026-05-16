import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ═══════════════════════════════════════════════════════════
// 🏗️ Layout — Minimal Wrapper
//    Navbar artık HomePage içinden yönetiliyor (props ile).
//    Layout yalnızca Toaster + Outlet sağlar.
// ═══════════════════════════════════════════════════════════

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main>
        <Outlet />
      </main>

      {/* 🍞 Premium Toast */}
      <Toaster
        position="bottom-right"
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "16px",
            background: "#1a1d2e",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            padding: "14px 18px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.06)",
            fontFamily: "'Inter', sans-serif",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
    </div>
  );
}
