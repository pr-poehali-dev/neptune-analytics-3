const AUTH_URL = "https://functions.poehali.dev/253e4b86-717f-4126-b1e5-ef72f338fd51"

export interface User {
  id: number
  name: string
  email: string
}

function getSession() {
  return localStorage.getItem("slimtrack_session") || ""
}

function setSession(id: string) {
  localStorage.setItem("slimtrack_session", id)
}

function clearSession() {
  localStorage.removeItem("slimtrack_session")
}

async function post(action: string, body: object) {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Session-Id": getSession() },
    body: JSON.stringify({ action, ...body }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Ошибка сервера")
  return data
}

export async function register(name: string, email: string, password: string): Promise<{ user: User; session_id: string }> {
  const data = await post("register", { name, email, password })
  setSession(data.session_id)
  return data
}

export async function login(email: string, password: string): Promise<{ user: User; session_id: string }> {
  const data = await post("login", { email, password })
  setSession(data.session_id)
  return data
}

export async function getMe(): Promise<User | null> {
  const session = getSession()
  if (!session) return null
  const res = await fetch(AUTH_URL, {
    headers: { "X-Session-Id": session },
  })
  if (!res.ok) { clearSession(); return null }
  const data = await res.json()
  return data.user
}

export function logout() {
  clearSession()
}
