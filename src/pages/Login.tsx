import React, { useState, useEffect } from "react";

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form State'leri
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@eventify.com");
  const [password, setPassword] = useState("123456");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Arayüz State'leri
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 3D Paralaks Efekti
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    setTimeout(() => {
      if (isLoginTab) {
        if (password.length < 6) {
          setError("Şifre en az 6 karakter olmalıdır.");
          setLoading(false);
          return;
        }
        localStorage.setItem("accessToken", "eventify-mock-jwt-token");
        onLoginSuccess();
      } else {
        if (!name.trim()) {
          setError("Lütfen adınızı ve soyadınızı girin.");
          setLoading(false);
          return;
        }
        setSuccessMsg(
          "Hesabınız başarıyla oluşturuldu! Eğlenceye katılmak için giriş yapın.",
        );
        setIsLoginTab(true);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#09020C] text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden select-none">
      {/* Arka Plan Parti Görseli ve Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 filter blur-[2px] transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#09020C]/80 via-[#15051B]/90 to-[#09020C]" />

      {/* Dynamic Pembe & Kırmızı Neon Işıklar */}
      <div
        className="absolute top-1/4 left-1/4 w-125 h-125 bg-gradient-to-tr from-pink-600/35 via-fuchsia-600/30 to-rose-600/25 rounded-full blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 1.8}px, ${mousePos.y * 1.8}px)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-112.5 h-112.5 bg-gradient-to-br from-rose-600/30 via-red-600/20 to-purple-600/30 rounded-full blur-[120px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${-mousePos.x * 1.3}px, ${-mousePos.y * 1.3}px)`,
        }}
      />

      {/* Grid Deseni */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b0764_1px,transparent_1px),linear-gradient(to_bottom,#3b0764_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Main Glass Card */}
      <div
        className="w-full max-w-md bg-[#12041A]/70 backdrop-blur-3xl border border-pink-500/20 rounded-[2.5rem] shadow-[0_25px_60px_rgba(225,29,72,0.25)] p-8 sm:p-10 z-10 transition-all duration-300 relative"
        style={{
          transform: `perspective(1000px) rotateX(${-mousePos.y * 0.15}deg) rotateY(${mousePos.x * 0.15}deg)`,
        }}
      >
        {/* Header (Disko Topu & Canlı Başlık) */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 text-white font-black text-4xl shadow-[0_0_40px_rgba(244,63,94,0.6)] mb-3 animate-pulse">
            🪩
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-pink-300 via-rose-200 to-white bg-clip-text text-transparent tracking-tight">
            Eventify
          </h1>
          <p className="text-xs font-bold text-pink-400/80 mt-1.5 tracking-wider uppercase">
            🎉 Etkinlik, Festival & Parti Dünyası
          </p>
        </div>

        {/* Tabs */}
        <div className="relative flex bg-[#0A020E]/80 p-1.5 rounded-2xl mb-6 border border-pink-900/40">
          <button
            type="button"
            onClick={() => {
              setIsLoginTab(true);
              setError("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 z-10 ${
              isLoginTab
                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_4px_20px_rgba(225,29,72,0.5)] scale-[1.02]"
                : "text-slate-400 hover:text-pink-300"
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginTab(false);
              setError("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 z-10 ${
              !isLoginTab
                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_4px_20px_rgba(225,29,72,0.5)] scale-[1.02]"
                : "text-slate-400 hover:text-pink-300"
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-2xl text-xs mb-5 flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl text-xs mb-5 flex items-center gap-3">
            <span className="font-bold">✓</span>
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-pink-200/90 ml-1">
                Ad Soyad
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Esranur Aygün"
                className="w-full bg-[#0A020E]/70 border border-pink-900/40 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-pink-500 text-slate-100 placeholder:text-slate-600 transition-colors"
                required={!isLoginTab}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-pink-200/90 ml-1">
              E-Posta Adresi
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="isim@ornek.com"
              className="w-full bg-[#0A020E]/70 border border-pink-900/40 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-pink-500 text-slate-100 placeholder:text-slate-600 transition-colors"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-pink-200/90 ml-1">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A020E]/70 border border-pink-900/40 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-pink-500 text-slate-100 placeholder:text-slate-600 pr-12 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-pink-400 text-xs font-bold px-2 py-1"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          {isLoginTab && (
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 font-semibold hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-pink-900/50 bg-[#0A020E] text-pink-600 accent-pink-600 cursor-pointer"
                />
                Beni Hatırla
              </label>
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Demo: Şifre sıfırlama bağlantısı e-postanıza gönderildi.",
                  )
                }
                className="text-pink-400 hover:text-pink-300 font-bold"
              >
                Şifremi Unuttum?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 hover:from-pink-500 hover:to-rose-500 active:scale-[0.98] text-white font-black py-3.5 rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.45)] transition-all duration-300 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Eğlence Başlıyor...</span>
              </div>
            ) : (
              <span className="tracking-wide">
                {isLoginTab ? "Aramıza Katıl →" : "Kayıt Ol →"}
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
