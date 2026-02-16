import { AppShell } from "@/components/app-shell"
import { DashboardClient } from "@/components/dashboard-client"
import { requireAuth } from "@/lib/auth/server"
import { serverDashboardAPI, serverDocumentsAPI, serverAnalysisAPI } from "@/lib/api/server"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"

async function DashboardContent() {
  // Require authentication - will redirect if not logged in
  const user = await requireAuth()
  
  // Fetch data in parallel on the server
  const [stats, documents] = await Promise.all([
    serverDashboardAPI.getStats(),
    serverDocumentsAPI.list(),
  ])
  
  // Fetch all analyses in parallel
  const documentIds = documents.map(doc => doc.document_id)
  const analysisMap = await serverAnalysisAPI.batchGetAnalyses(documentIds)
  
  return (
    <DashboardClient 
      stats={stats}
      documents={documents}
      analysisMap={analysisMap}
      userName={user.email.split('@')[0]}
    />
  )
}

export default function DashboardPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </AppShell>
  )
}
