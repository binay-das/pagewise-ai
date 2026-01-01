import { Navbar } from "@/components/layout/navbar"
import { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  )
}
