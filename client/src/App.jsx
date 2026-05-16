import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            {/* Login ve Register sayfaları modal yapısına geçirildiği için buradan kaldırıldı */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
