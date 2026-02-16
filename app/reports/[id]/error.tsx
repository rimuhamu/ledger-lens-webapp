'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ReportError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Report analysis error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Failed to Load Report
        </h1>
        
        <p className="text-muted-foreground mb-6">
          We couldn't load this analysis report. The document may not exist or there was an error processing it.
        </p>

        {error.message && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-left">
            <p className="text-xs text-muted-foreground mb-1">Error details:</p>
            <p className="text-sm text-destructive font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push('/reports')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Button>
        </div>
      </div>
    </div>
  )
}
