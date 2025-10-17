import { Navbar } from "@/components/layout/navbar"
import { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen lg:h-screen">
      <Navbar />

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
