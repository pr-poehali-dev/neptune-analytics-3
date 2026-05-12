import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"
import { register, login, type User } from "@/lib/api"

interface AuthPageProps {
  onAuth: (user: User) => void
}

export function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError("")
    setLoading(true)
    try {
      const data = mode === "register"
        ? await register(name, email, password)
        : await login(email, password)
      onAuth(data.user)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка")
    } finally {
      setLoading(false)
    }
  }

  const isReady = email && password && (mode === "login" || name)

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />

      <motion.div className="fixed z-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)", filter: "blur(60px)", top: "-10%", left: "-10%" }}
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="fixed z-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(52,211,153,0.2) 0%, transparent 70%)", filter: "blur(80px)", bottom: "-10%", right: "-10%" }}
        animate={{ x: [0, -60, 0], y: [0, -40, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-[380px] rounded-[28px] p-6 space-y-5"
        style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
      >
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
              <Icon name="TrendingDown" size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">SlimTrack</h1>
          </div>
          <p className="text-xs text-gray-500">Твой личный трекер похудения</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(0,0,0,0.04)" }}>
          {(["login", "register"] as const).map(m => (
            <motion.button key={m} onClick={() => { setMode(m); setError("") }}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: mode === m ? "white" : "transparent", color: mode === m ? "#111827" : "#9ca3af", boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
              {m === "login" ? "Войти" : "Регистрация"}
            </motion.button>
          ))}
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <AnimatePresence>
            {mode === "register" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <input
                  placeholder="Твоё имя"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none"
                  style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.6)" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none"
            style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.6)" }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none"
            style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.6)" }}
          />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-xs text-red-500 text-center px-2">
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: isReady && !loading ? 1.02 : 1 }}
          whileTap={{ scale: isReady && !loading ? 0.98 : 1 }}
          onClick={submit}
          disabled={!isReady || loading}
          className="w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
          style={{
            background: isReady && !loading ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(200,200,200,0.4)",
            color: isReady && !loading ? "white" : "#9ca3af",
          }}
        >
          {loading
            ? <><Icon name="Loader" size={16} className="animate-spin" /><span>Загрузка...</span></>
            : mode === "login" ? "Войти" : "Создать аккаунт"
          }
        </motion.button>
      </motion.div>
    </main>
  )
}
