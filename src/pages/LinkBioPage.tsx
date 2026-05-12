import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProfileSection } from "@/components/ProfileSection"
import { LinkCard } from "@/components/LinkCard"
import { SocialFooter } from "@/components/SocialFooter"
import { FoodDiary } from "@/components/FoodDiary"
import { CalorieCalculator } from "@/components/CalorieCalculator"
import { WeightTracker } from "@/components/WeightTracker"
import { Notes } from "@/components/Notes"
import { Activity, Apple, CalendarCheck, TrendingDown, FileText, MessageCircle, Send, Mail, NotebookPen } from "lucide-react"

const links = [
  {
    title: "Начать отслеживать вес",
    description: "Запустить трекер прямо сейчас",
    href: "#",
    icon: TrendingDown,
  },
  {
    title: "Дневник питания",
    description: "Записывай КБЖУ и приёмы пищи",
    href: "#",
    icon: Apple,
  },
  {
    title: "Калькулятор калорий",
    description: "Рассчитай норму по твоим параметрам",
    href: "#",
    icon: Activity,
  },

  {
    title: "Мой план похудения",
    description: "Персональная программа на 30 дней",
    href: "#",
    icon: CalendarCheck,
  },
  {
    title: "Заметки",
    description: "Мысли, цели и наблюдения",
    href: "#",
    icon: NotebookPen,
  },
  {
    title: "Бесплатный гайд",
    description: "5 правил, которые реально работают",
    href: "#",
    icon: FileText,
  },
]

const socials = [
  { icon: Send, href: "#", label: "Telegram" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
  { icon: Mail, href: "#", label: "Email" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
    },
  },
}

export function LinkBioPage() {
  const [showDiary, setShowDiary] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const [showWeight, setShowWeight] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  return (
    <main className="relative min-h-screen px-6 py-10 flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />

      {/* Animated gradient orbs */}
      <motion.div
        className="fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
          top: "-10%",
          left: "-10%",
        }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed z-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 70%)",
          filter: "blur(80px)",
          top: "30%",
          right: "-20%",
        }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, 80, -40, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed z-0 w-[450px] h-[450px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(5, 150, 105, 0.2) 0%, transparent 70%)",
          filter: "blur(70px)",
          bottom: "-5%",
          left: "20%",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -60, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed z-0 w-[350px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          filter: "blur(50px)",
          top: "60%",
          left: "-5%",
        }}
        animate={{
          x: [0, 40, 80, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.2, 1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed inset-0 z-0 pointer-events-none opacity-60"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(255,255,255,0.4), transparent 50%)",
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 30% 80%, rgba(255,255,255,0.4), transparent 50%)",
            "radial-gradient(ellipse 80% 60% at 80% 40%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 60% 60%, rgba(255,255,255,0.4), transparent 50%)",
            "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(255,255,255,0.4), transparent 50%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed z-0 pointer-events-none"
        style={{
          width: "200%",
          height: "100px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          transform: "rotate(-35deg)",
          top: "20%",
          left: "-50%",
        }}
        animate={{
          left: ["-50%", "100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 4,
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 mx-auto max-w-[400px] w-full flex flex-col flex-1 justify-between"
      >
        <motion.div variants={itemVariants} className="pt-2">
          <ProfileSection
            name="SlimTrack"
            bio="Твой личный трекер похудения — фиксируй прогресс, достигай целей 🎯"
            imageUrl="https://cdn.poehali.dev/projects/03f75943-3321-4ff7-a3ed-0cb52d66ba61/bucket/762b6ced-3dba-4963-b372-f31dbb498b8b.jpg"
          />
        </motion.div>

        <motion.div className="space-y-3 py-8" variants={containerVariants}>
          {links.map((link) => (
            <motion.div key={link.title} variants={itemVariants}>
              <LinkCard
                {...link}
                onClick={
                  link.title === "Дневник питания" ? () => setShowDiary(true) :
                  link.title === "Калькулятор калорий" ? () => setShowCalc(true) :
                  link.title === "Начать отслеживать вес" ? () => setShowWeight(true) :
                  link.title === "Заметки" ? () => setShowNotes(true) :
                  undefined
                }
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="pb-2">
          <SocialFooter socials={socials} copyright="2026 SlimTrack" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showDiary && <FoodDiary onClose={() => setShowDiary(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCalc && <CalorieCalculator onClose={() => setShowCalc(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showWeight && <WeightTracker onClose={() => setShowWeight(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showNotes && <Notes onClose={() => setShowNotes(false)} />}
      </AnimatePresence>
    </main>
  )
}