import { useEffect, useState } from "react"
import { LinkBioPage } from "./pages/LinkBioPage"
import { AuthPage } from "./pages/AuthPage"
import { getMe, logout, type User } from "./lib/api"

function App() {
  const [user, setUser] = useState<User | null | "loading">("loading")

  useEffect(() => {
    getMe().then(u => setUser(u))
  }, [])

  if (user === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
      </main>
    )
  }

  if (!user) {
    return <AuthPage onAuth={setUser} />
  }

  return <LinkBioPage user={user} onLogout={() => { logout(); setUser(null) }} />
}

export default App
