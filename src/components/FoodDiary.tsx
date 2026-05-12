import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

interface FoodEntry {
  id: number
  name: string
  calories: number
  protein: number
  fat: number
  carbs: number
  time: string
  meal: "breakfast" | "lunch" | "dinner" | "snack"
}

const mealLabels = {
  breakfast: "Завтрак",
  lunch: "Обед",
  dinner: "Ужин",
  snack: "Перекус",
}

const mealColors = {
  breakfast: "rgba(251, 191, 36, 0.15)",
  lunch: "rgba(16, 185, 129, 0.15)",
  dinner: "rgba(99, 102, 241, 0.15)",
  snack: "rgba(249, 115, 22, 0.15)",
}

interface FoodDiaryProps {
  onClose: () => void
}

export function FoodDiary({ onClose }: FoodDiaryProps) {
  const [entries, setEntries] = useState<FoodEntry[]>([
    { id: 1, name: "Овсянка с ягодами", calories: 280, protein: 8, fat: 5, carbs: 52, time: "08:30", meal: "breakfast" },
    { id: 2, name: "Куриная грудка с рисом", calories: 420, protein: 38, fat: 6, carbs: 48, time: "13:00", meal: "lunch" },
    { id: 3, name: "Яблоко", calories: 80, protein: 0, fat: 0, carbs: 20, time: "16:00", meal: "snack" },
  ])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", calories: "", protein: "", fat: "", carbs: "", meal: "breakfast" as FoodEntry["meal"] })

  const totalCalories = entries.reduce((s, e) => s + e.calories, 0)
  const totalProtein = entries.reduce((s, e) => s + e.protein, 0)
  const totalFat = entries.reduce((s, e) => s + e.fat, 0)
  const totalCarbs = entries.reduce((s, e) => s + e.carbs, 0)
  const goalCalories = 1800

  const addEntry = () => {
    if (!form.name || !form.calories) return
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    setEntries(prev => [...prev, {
      id: Date.now(),
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      fat: Number(form.fat) || 0,
      carbs: Number(form.carbs) || 0,
      time,
      meal: form.meal,
    }])
    setForm({ name: "", calories: "", protein: "", fat: "", carbs: "", meal: "breakfast" })
    setShowForm(false)
  }

  const removeEntry = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const progress = Math.min((totalCalories / goalCalories) * 100, 100)

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
      <div className="flex items-center justify-between px-5 pt-10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Дневник питания</h2>
          <p className="text-xs text-gray-500 mt-0.5">{new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}</p>
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

      {/* Calories summary */}
      <div className="mx-5 mb-4 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)" }}>
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs text-gray-500">Съедено</p>
            <p className="text-2xl font-bold text-gray-800">{totalCalories} <span className="text-sm font-normal text-gray-500">/ {goalCalories} ккал</span></p>
          </div>
          <p className="text-sm font-semibold text-emerald-600">{goalCalories - totalCalories > 0 ? `−${goalCalories - totalCalories} ккал осталось` : "Цель достигнута"}</p>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #10b981, #34d399)" }}
          />
        </div>
        <div className="flex justify-between mt-3 text-center">
          {[["Белки", totalProtein, "г"], ["Жиры", totalFat, "г"], ["Углеводы", totalCarbs, "г"]].map(([label, val, unit]) => (
            <div key={label as string}>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm font-semibold text-gray-700">{val}{unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Entries list */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-2">
        <AnimatePresence>
          {entries.map(entry => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ background: mealColors[entry.meal], border: "1px solid rgba(255,255,255,0.6)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{mealLabels[entry.meal]}</span>
                  <span className="text-[10px] text-gray-400">{entry.time}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate">{entry.name}</p>
                <p className="text-xs text-gray-500">Б {entry.protein}г · Ж {entry.fat}г · У {entry.carbs}г</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-700">{entry.calories}</span>
                <span className="text-xs text-gray-400">ккал</span>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeEntry(entry.id)} className="ml-1 text-gray-300 hover:text-red-400 transition-colors">
                  <Icon name="Trash2" size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-5 mb-3 rounded-2xl p-4 space-y-3"
            style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.8)" }}
          >
            <select
              value={form.meal}
              onChange={e => setForm(f => ({ ...f, meal: e.target.value as FoodEntry["meal"] }))}
              className="w-full text-sm rounded-xl px-3 py-2 bg-white/60 border border-white/50 text-gray-700 outline-none"
            >
              {Object.entries(mealLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input
              placeholder="Название блюда"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full text-sm rounded-xl px-3 py-2 bg-white/60 border border-white/50 text-gray-700 placeholder-gray-400 outline-none"
            />
            <div className="grid grid-cols-4 gap-2">
              {[["Ккал", "calories"], ["Белки", "protein"], ["Жиры", "fat"], ["Углеводы", "carbs"]].map(([label, key]) => (
                <input
                  key={key}
                  placeholder={label}
                  type="number"
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="text-sm rounded-xl px-2 py-2 bg-white/60 border border-white/50 text-gray-700 placeholder-gray-400 outline-none text-center"
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addEntry}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
            >
              Добавить
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add button */}
      <div className="px-5 pb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(v => !v)}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            background: showForm ? "rgba(255,255,255,0.5)" : "linear-gradient(135deg, #10b981, #059669)",
            color: showForm ? "#6b7280" : "white",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <Icon name={showForm ? "ChevronDown" : "Plus"} size={16} />
          {showForm ? "Свернуть" : "Добавить приём пищи"}
        </motion.button>
      </div>
    </motion.div>
  )
}
