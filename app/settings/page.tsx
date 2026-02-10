"use client"

import { AppShell } from "@/components/app-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Key, Bell, Monitor, User, Info, Landmark } from "lucide-react"

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account, API configuration, and preferences.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* API Configuration */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <Key className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                API Configuration
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <Label
                  htmlFor="api-key"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  API Key
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="api-key"
                    type="password"
                    defaultValue="sk-xxxxxxxxxxxxxxxxxxxx"
                    className="bg-surface border-border text-foreground font-mono"
                  />
                  <Button
                    variant="outline"
                    className="bg-transparent border-border text-foreground hover:bg-secondary shrink-0"
                  >
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Your API key is used to authenticate requests to the
                  LedgerLens analysis engine.
                </p>
              </div>
              <div>
                <Label
                  htmlFor="model"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  AI Model
                </Label>
                <Input
                  id="model"
                  defaultValue="LLM-4o-V2"
                  className="bg-surface border-border text-foreground font-mono max-w-xs"
                  readOnly
                />
              </div>
            </div>
          </section>

          {/* Notification Preferences */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Notifications
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Analysis Complete
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Notify when a report analysis is finished.
                  </p>
                </div>
                <Switch defaultChecked id="notif-analysis" />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Risk Alerts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get alerted when high-risk factors are detected.
                  </p>
                </div>
                <Switch defaultChecked id="notif-risk" />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Weekly Digest
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Receive a weekly summary of portfolio insights.
                  </p>
                </div>
                <Switch id="notif-weekly" />
              </div>
            </div>
          </section>

          {/* Display Settings */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <Monitor className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Display
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Dark Mode
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Use dark theme across the application.
                  </p>
                </div>
                <Switch defaultChecked id="dark-mode" />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Compact View
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Reduce spacing for denser information display.
                  </p>
                </div>
                <Switch id="compact-view" />
              </div>
            </div>
          </section>

          {/* Account */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Account
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">
                    Name
                  </Label>
                  <Input
                    defaultValue="Alex Chen"
                    className="bg-surface border-border text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">
                    Email
                  </Label>
                  <Input
                    defaultValue="alex.chen@ledgerlens.ai"
                    className="bg-surface border-border text-foreground"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">
                  Role
                </Label>
                <Input
                  defaultValue="Senior Analyst"
                  className="bg-surface border-border text-foreground max-w-xs"
                  readOnly
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <Info className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">About</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Landmark className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  LedgerLens Intelligence
                </p>
                <p className="text-xs text-muted-foreground">
                  Version 2.4.0 - AI-Powered Financial Analysis Platform
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}
