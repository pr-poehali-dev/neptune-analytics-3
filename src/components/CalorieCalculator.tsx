import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

interface CalorieCalculatorProps {
  onClose: () => void
}

type Goal = "loss" | "maintain" | "gain"
type Activity = "sedentary" | "light" | "moderate" | "active" | "veryActive"

const activityLabels: Record<Activity, string> = {
  sedentary: "Сидячий образ жизни",
  light: "Лёгкая активность (1-3 дня/нед)",
  moderate: "Умеренная (3-5 дней/нед)",
  active: "Высокая (6-7 дней/нед)",
  veryActive: "Очень высокая (спорт + физ. работа)",
}

const activityMultipliers: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
}

const goalLabels: Record<Goal, string> = {
  loss: "Похудеть",
  maintain: "Поддержать вес",
  gain: "Набрать массу",
}

const goalDeltas: Record<Goal, number> = {
  loss: -500,
  maintain: 0,
  gain: +300,
}

export function CalorieCalculator({ onClose }: CalorieCalculatorProps) {
  const [gender, setGender] = useState<"male" | "female">("female")
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [activity, setActivity] = useState<Activity>("moderate")
  const [goal, setGoal] = useState<Goal>("loss")
  const [result, setResult] = useState<null | { calories: number; protein: number; fat: number; carbs: number }>(null)

  const calculate = () => {
    const a = Number(age)
    const h = Number(height)
    const w = Number(weight)
    if (!a || !h || !w) return

    // Mifflin-St Jeor formula
    const bmr = gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161

    const tdee = bmr * activityMultipliers[activity]
    const calories = Math.round(tdee + goalDeltas[goal])
    const protein = Math.round(w * 1.8)
    const fat = Math.round((calories * 0.25) / 9)
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)

    setResult({ calories, protein, fat, carbs })
  }

  const isReady = age && height && weight

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
      style={{
        background: "rgba(240, 253, 244, 0.92)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Калькулятор калорий</h2>
          <p className="text-xs text-gray-500 mt-0.5">Рассчитай свою дневную норму</p>
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

      <div className="px-5 pb-10 space-y-4">
        {/* Gender */}
        <div className="rounded-2xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)" }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Пол</p>
          <div className="flex gap-2">
            {(["female", "male"] as const).map(g => (
              <motion.button
                key={g}
                whileTap={{ scale: 0.96 }}
                onClick={() => setGender(g)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: gender === g ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.5)",
                  color: gender === g ? "white" : "#6b7280",
                  border: "1px solid rgba(255,255,255,0.5)",
                }}
              >
                {g === "female" ? "Женский" : "Мужской"}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)" }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Параметры</p>
          {[
            { label: "Возраст", key: "age", val: age, set: setAge, unit: "лет", placeholder: "25" },
            { label: "Рост", key: "height", val: height, set: setHeight, unit: "см", placeholder: "165" },
            { label: "Вес", key: "weight", val: weight, set: setWeight, unit: "кг", placeholder: "70" },
          ].map(({ label, val, set, unit, placeholder }) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700 w-20 shrink-0">{label}</span>
              <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.6)" }}>
                <input
                  type="number"
                  placeholder={placeholder}
                  value={val}
                  onChange={e => set(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-800 outline-none min-w-0"
                />
                <span className="text-xs text-gray-400 shrink-0">{unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div className="rounded-2xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)" }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Активность</p>
          <div className="space-y-1.5">
            {(Object.keys(activityLabels) as Activity[]).map(a => (
              <motion.button
                key={a}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivity(a)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                style={{
                  background: activity === a ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.4)",
                  border: activity === a ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.4)",
                  color: activity === a ? "#065f46" : "#6b7280",
                  fontWeight: activity === a ? 600 : 400,
                }}
              >
                {activity === a && <Icon name="Check" size={14} className="text-emerald-600 shrink-0" />}
                {activityLabels[a]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="rounded-2xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)" }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Цель</p>
          <div className="flex gap-2">
            {(Object.keys(goalLabels) as Goal[]).map(g => (
              <motion.button
                key={g}
                whileTap={{ scale: 0.96 }}
                onClick={() => setGoal(g)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: goal === g ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.5)",
                  color: goal === g ? "white" : "#6b7280",
                  border: "1px solid rgba(255,255,255,0.5)",
                }}
              >
                {goalLabels[g]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Calculate button */}
        <motion.button
          whileHover={{ scale: isReady ? 1.02 : 1 }}
          whileTap={{ scale: isReady ? 0.98 : 1 }}
          onClick={calculate}
          className="w-full py-4 rounded-2xl text-sm font-bold transition-all"
          style={{
            background: isReady ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(200,200,200,0.4)",
            color: isReady ? "white" : "#9ca3af",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          Рассчитать норму
        </motion.button>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
            >
              <div className="text-center">
                <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide mb-1">Твоя норма в день</p>
                <p className="text-4xl font-black text-emerald-700">{result.calories}</p>
                <p className="text-sm text-emerald-600">калорий</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Белки", val: result.protein, unit: "г", color: "#3b82f6" },
                  { label: "Жиры", val: result.fat, unit: "г", color: "#f59e0b" },
                  { label: "Углеводы", val: result.carbs, unit: "г", color: "#10b981" },
                ].map(({ label, val, unit, color }) => (
                  <div key={label} className="text-center rounded-xl py-3" style={{ background: "rgba(255,255,255,0.6)" }}>
                    <p className="text-lg font-bold" style={{ color }}>{val}{unit}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-emerald-700 opacity-70">
                Расчёт по формуле Миффлина-Сан Жеора
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
