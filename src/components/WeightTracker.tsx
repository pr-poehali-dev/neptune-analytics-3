import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

interface WeightEntry {
  id: number
  date: string
  weight: number
}

interface WeightTrackerProps {
  onClose: () => void
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
}

const initialEntries: WeightEntry[] = [
  { id: 1, date: "2026-04-20", weight: 78.5 },
  { id: 2, date: "2026-04-25", weight: 77.8 },
  { id: 3, date: "2026-05-01", weight: 77.1 },
  { id: 4, date: "2026-05-05", weight: 76.4 },
  { id: 5, date: "2026-05-10", weight: 75.9 },
]

export function WeightTracker({ onClose }: WeightTrackerProps) {
  const [entries, setEntries] = useState<WeightEntry[]>(initialEntries)
  const [newWeight, setNewWeight] = useState("")
  const [showInput, setShowInput] = useState(false)

  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const first = sorted[0]?.weight ?? 0
  const last = sorted[sorted.length - 1]?.weight ?? 0
  const diff = +(last - first).toFixed(1)
  const goal = first - 10

  const minW = Math.min(...sorted.map(e => e.weight)) - 1
  const maxW = Math.max(...sorted.map(e => e.weight)) + 1
  const range = maxW - minW

  const chartW = 320
  const chartH = 140
  const pad = { left: 36, right: 16, top: 16, bottom: 24 }
  const innerW = chartW - pad.left - pad.right
  const innerH = chartH - pad.top - pad.bottom

  const points = sorted.map((e, i) => ({
    x: pad.left + (i / Math.max(sorted.length - 1, 1)) * innerW,
    y: pad.top + ((maxW - e.weight) / range) * innerH,
    entry: e,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartH - pad.bottom} L ${points[0].x} ${chartH - pad.bottom} Z`
    : ""

  const addEntry = () => {
    const w = parseFloat(newWeight)
    if (!w || w < 30 || w > 300) return
    const today = new Date().toISOString().split("T")[0]
    setEntries(prev => {
      const filtered = prev.filter(e => e.date !== today)
      return [...filtered, { id: Date.now(), date: today, weight: w }]
    })
    setNewWeight("")
    setShowInput(false)
  }

  const yLabels = [maxW, maxW - range / 2, minW].map(v => v.toFixed(1))

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
          <h2 className="text-xl font-bold text-gray-800">Трекер веса</h2>
          <p className="text-xs text-gray-500 mt-0.5">Фиксируй прогресс каждый день</p>
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
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Начало", value: `${first} кг`, icon: "Flag", color: "#6b7280" },
            { label: "Сейчас", value: `${last} кг`, icon: "Scale", color: "#10b981" },
            { label: "Изменение", value: `${diff > 0 ? "+" : ""}${diff} кг`, icon: "TrendingDown", color: diff < 0 ? "#10b981" : "#f59e0b" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)" }}>
              <Icon name={icon} size={18} className="mx-auto mb-1" style={{ color }} />
              <p className="text-sm font-bold text-gray-800">{value}</p>
              <p className="text-[10px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)" }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">График веса</p>
          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            {[0, 0.5, 1].map((t, i) => (
              <line
                key={i}
                x1={pad.left} y1={pad.top + t * innerH}
                x2={chartW - pad.right} y2={pad.top + t * innerH}
                stroke="rgba(0,0,0,0.06)" strokeWidth="1"
              />
            ))}
            {/* Y labels */}
            {yLabels.map((label, i) => (
              <text key={i} x={pad.left - 4} y={pad.top + (i * innerH) / 2 + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{label}</text>
            ))}
            {/* X labels */}
            {sorted.map((e, i) => (
              <text key={e.id} x={pad.left + (i / Math.max(sorted.length - 1, 1)) * innerW} y={chartH - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">
                {formatDate(e.date)}
              </text>
            ))}
            {/* Goal line */}
            {goal > minW && goal < maxW && (
              <>
                <line
                  x1={pad.left} y1={pad.top + ((maxW - goal) / range) * innerH}
                  x2={chartW - pad.right} y2={pad.top + ((maxW - goal) / range) * innerH}
                  stroke="rgba(239,68,68,0.3)" strokeWidth="1" strokeDasharray="4 3"
                />
                <text x={chartW - pad.right + 2} y={pad.top + ((maxW - goal) / range) * innerH + 4} fontSize="8" fill="rgba(239,68,68,0.6)">цель</text>
              </>
            )}
            {/* Area */}
            {areaD && (
              <path d={areaD} fill="url(#areaGrad)" opacity="0.4" />
            )}
            {/* Line */}
            {pathD && (
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            )}
            {/* Dots */}
            {points.map((p, i) => (
              <motion.circle
                key={p.entry.id}
                cx={p.x} cy={p.y} r="4"
                fill="white"
                stroke="#10b981"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.08 }}
              />
            ))}
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Add weight */}
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="rounded-2xl p-4 flex gap-3 items-center"
              style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.8)" }}
            >
              <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.6)" }}>
                <input
                  autoFocus
                  type="number"
                  step="0.1"
                  placeholder="75.5"
                  value={newWeight}
                  onChange={e => setNewWeight(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addEntry()}
                  className="flex-1 bg-transparent text-sm text-gray-800 outline-none"
                />
                <span className="text-xs text-gray-400">кг</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addEntry}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
              >
                Добавить
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowInput(v => !v)}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            background: showInput ? "rgba(255,255,255,0.5)" : "linear-gradient(135deg, #10b981, #059669)",
            color: showInput ? "#6b7280" : "white",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <Icon name={showInput ? "ChevronDown" : "Plus"} size={16} />
          {showInput ? "Свернуть" : "Записать вес сегодня"}
        </motion.button>

        {/* History */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.7)" }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 pt-4 pb-2">История</p>
          {[...sorted].reverse().map((entry, i) => {
            const prev = sorted[sorted.length - 2 - i]
            const delta = prev ? +(entry.weight - prev.weight).toFixed(1) : null
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between px-4 py-3 border-t border-white/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-sm text-gray-600">{formatDate(entry.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {delta !== null && (
                    <span className="text-xs font-medium" style={{ color: delta < 0 ? "#10b981" : delta > 0 ? "#f59e0b" : "#9ca3af" }}>
                      {delta > 0 ? "+" : ""}{delta} кг
                    </span>
                  )}
                  <span className="text-sm font-bold text-gray-800">{entry.weight} кг</span>
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setEntries(p => p.filter(e => e.id !== entry.id))} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                    <Icon name="Trash2" size={13} />
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
