"use client"

import React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { AppFooter } from "@/components/app-footer"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1">{children}</main>
        <AppFooter />
      </div>
    </div>
  )
}
