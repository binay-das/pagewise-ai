"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { LogOut, Sparkles } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { ModeToggle } from "../theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { data: session } = useSession();
  const pathName = usePathname();

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/"
    })
  }

  if (!mounted || pathName === "/") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-neutral-950/80">
      <div className="max-w-7xl mx-auto flex h-16 border-b border-neutral-200 dark:border-neutral-800 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={session ? "/documents" : "/"}
          className="flex items-center space-x-3 group"
        >
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <Sparkles className="w-4 h-4 text-white dark:text-black" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            PageWise
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ModeToggle />

          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback className="bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                      {session.user.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    {session.user.name && (
                      <p className="font-medium text-sm text-neutral-900 dark:text-white">
                        {session.user.name}
                      </p>
                    )}
                    <p className="w-[200px] truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer"
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