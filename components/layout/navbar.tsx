"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { ModeToggle } from "../theme-toggle"

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: "/" 
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/80">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        <Link 
          href="/dashboard" 
          className="text-2xl font-bold text-slate-900 transition-colors duration-200 hover:text-blue-600 dark:text-slate-50 dark:hover:text-blue-500"
        >
          PagewiseAI
        </Link>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-9 h-9">
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm text-slate-600 border-b dark:text-slate-400 dark:border-slate-800">
                  {session.user.email}
                </div>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer focus:text-red-600 dark:text-red-500 dark:focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}