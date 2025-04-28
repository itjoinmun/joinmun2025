'use client'
import { cn } from '@/utils/cn'
import { useRouter } from 'next/navigation'

const BackLink = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
  const router = useRouter()
  const handleBack = () => {
    router.back()
  }

  return <div onClick={handleBack} className={cn(className)}>{children}</div>
}

export default BackLink
