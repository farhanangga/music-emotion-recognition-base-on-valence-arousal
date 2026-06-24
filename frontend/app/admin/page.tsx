"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true);

    // dummy login
    setTimeout(() => {
      if (
        email === "farhanangga8900@musify.com" &&
        password === "12345678"
      ) {
        localStorage.setItem(
          "auth",
          "true"
        );

        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
          })
        );

        router.push("/admin/songs/add");
      } else {
        alert(
          "Email atau password salah"
        );
      }

      setLoading(false);
    }, 800);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center relative overflow-hidden">

      {/* glow background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[180px]" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative z-10">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          <p className="text-xs text-white/50 text-center mt-4">
            Demo account:
            admin@music.com / 123456
          </p>
        </div>
      </div>
    </main>
  );
}