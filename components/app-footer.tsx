import { Landmark } from "lucide-react"
import Link from "next/link"

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "API Docs", href: "#" },
  { label: "Support", href: "#" },
]

export function AppFooter() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            LedgerLens v2.4.0
          </span>
        </div>
        <nav className="flex items-center gap-6" aria-label="Footer">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          {"2024 LedgerLens Intelligence. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}
