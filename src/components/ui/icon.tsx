import { icons, type LucideProps } from "lucide-react"

interface IconProps extends LucideProps {
  name: string
  fallback?: string
}

export default function Icon({ name, fallback, ...props }: IconProps) {
  const LucideIcon = icons[name as keyof typeof icons] ?? (fallback ? icons[fallback as keyof typeof icons] : null)
  if (!LucideIcon) return null
  return <LucideIcon {...props} />
}
