import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"
import { useLocalStorage } from "@/lib/useLocalStorage"

interface Note {
  id: number
  text: string
  createdAt: string
  color: string
}

interface NotesProps {
  onClose: () => void
}

const NOTE_COLORS = [
  "rgba(16,185,129,0.12)",
  "rgba(59,130,246,0.12)",
  "rgba(251,191,36,0.15)",
  "rgba(249,115,22,0.12)",
  "rgba(168,85,247,0.12)",
]

const initialNotes: Note[] = [
  { id: 1, text: "Сегодня выпила 2 литра воды — молодец! 💧", createdAt: "2026-05-10T09:00:00", color: NOTE_COLORS[0] },
  { id: 2, text: "Цель на май: минус 3 кг. Держусь!", createdAt: "2026-05-08T18:30:00", color: NOTE_COLORS[2] },
  { id: 3, text: "Заменила ужин на лёгкий салат — чувствую себя лучше", createdAt: "2026-05-06T20:00:00", color: NOTE_COLORS[1] },
]

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })
}

export function Notes({ onClose }: NotesProps) {
  const [notes, setNotes] = useLocalStorage<Note[]>("slimtrack_notes", initialNotes)
  const [text, setText] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [colorIdx, setColorIdx] = useState(0)

  const save = () => {
    if (!text.trim()) return
    if (editId !== null) {
      setNotes(prev => prev.map(n => n.id === editId ? { ...n, text: text.trim() } : n))
      setEditId(null)
    } else {
      setNotes(prev => [{
        id: Date.now(),
        text: text.trim(),
        createdAt: new Date().toISOString(),
        color: NOTE_COLORS[colorIdx],
      }, ...prev])
      setColorIdx(i => (i + 1) % NOTE_COLORS.length)
    }
    setText("")
    setShowForm(false)
  }

  const startEdit = (note: Note) => {
    setEditId(note.id)
    setText(note.text)
    setShowForm(true)
  }

  const remove = (id: number) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const cancel = () => {
    setText("")
    setEditId(null)
    setShowForm(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: "rgba(240, 253, 244, 0.92)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Заметки</h2>
          <p className="text-xs text-gray-500 mt-0.5">{notes.length} {notes.length === 1 ? "заметка" : notes.length < 5 ? "заметки" : "заметок"}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.6)" }}
        >
          <Icon name="X" size={18} className="text-gray-600" />
        </motion.button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3">
        <AnimatePresence>
          {notes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Icon name="NotebookPen" size={40} className="text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">Пока нет заметок</p>
              <p className="text-xs text-gray-300 mt-1">Нажми «+» чтобы добавить первую</p>
            </motion.div>
          )}
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl p-4 relative group"
              style={{ background: note.color, border: "1px solid rgba(255,255,255,0.6)" }}
            >
              <p className="text-sm text-gray-800 leading-relaxed pr-12 whitespace-pre-wrap">{note.text}</p>
              <p className="text-[10px] text-gray-400 mt-2">{formatDate(note.createdAt)}</p>
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => startEdit(note)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600"
                  style={{ background: "rgba(255,255,255,0.6)" }}
                >
                  <Icon name="Pencil" size={13} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => remove(note.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 hover:text-red-400"
                  style={{ background: "rgba(255,255,255,0.6)" }}
                >
                  <Icon name="Trash2" size={13} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-5 mb-3 rounded-2xl p-4 space-y-3"
            style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.9)" }}
          >
            <textarea
              autoFocus
              placeholder="Напиши заметку — наблюдение, цель, мысль..."
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none resize-none"
            />
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={cancel}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500"
                style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                Отмена
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={save}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: text.trim() ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(200,200,200,0.5)", color: text.trim() ? "white" : "#9ca3af" }}
              >
                {editId !== null ? "Сохранить" : "Добавить"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add button */}
      <div className="px-5 pb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowForm(v => !v); if (showForm) cancel() }}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            background: showForm ? "rgba(255,255,255,0.5)" : "linear-gradient(135deg, #10b981, #059669)",
            color: showForm ? "#6b7280" : "white",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <Icon name={showForm ? "ChevronDown" : "Plus"} size={16} />
          {showForm ? "Свернуть" : "Новая заметка"}
        </motion.button>
      </div>
    </motion.div>
  )
}