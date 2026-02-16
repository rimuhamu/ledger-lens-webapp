'use client'

import { Check, Loader2, Circle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalysisStatus, AnalysisStage } from '@/lib/api/types'

interface AnalysisProgressProps {
  status: AnalysisStatus | null
  className?: string
}

interface StageInfo {
  stage: AnalysisStage
  label: string
  description: string
}

const STAGES: StageInfo[] = [
  {
    stage: 'uploading',
    label: 'Upload',
    description: 'Uploading and processing document',
  },
  {
    stage: 'research',
    label: 'Research',
    description: 'Retrieving relevant documents and data',
  },
  {
    stage: 'analysis',
    label: 'Analysis',
    description: 'Analyzing financial data and extracting insights',
  },
  {
    stage: 'validation',
    label: 'Validation',
    description: 'Verifying results against source documents',
  },
  {
    stage: 'intelligence',
    label: 'Intelligence',
    description: 'Generating final intelligence report',
  },
]

function getStageStatus(
  currentStageIndex: number,
  stageIndex: number,
  analysisStatus: string
): 'complete' | 'in-progress' | 'pending' | 'failed' {
  if (analysisStatus === 'failed' && stageIndex === currentStageIndex) return 'failed'
  if (stageIndex < currentStageIndex) return 'complete'
  if (stageIndex === currentStageIndex) return 'in-progress'
  return 'pending'
}

export function AnalysisProgress({ status, className }: AnalysisProgressProps) {
  // Find the index of the current stage in our frontend STAGES array
  // This is more robust than relying on the backend's index, especially since we added 'uploading'
  const currentStageName = status?.current_stage
  const stageIndex = currentStageName 
    ? STAGES.findIndex(s => s.stage === currentStageName)
    : -1

  // Safe calculation of progress percentage
  // Start at 0% for the first stage (uploading)
  const totalStages = STAGES.length
  const progressPercentage = status 
    ? status.status === 'completed' 
      ? 100 
      : Math.min(Math.max(Math.round((stageIndex / totalStages) * 100), 0), 95) // Cap at 95% until complete
    : 0

  if (!status) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Initializing analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-xl border border-border bg-card p-6 shadow-sm', className)}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-foreground">
            {status.status === 'completed' ? 'Analysis Complete' : 'Analysis in Progress'}
          </h3>
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium",
            status.status === 'completed' && "bg-emerald-500/10 text-emerald-600",
            status.status === 'failed' && "bg-destructive/10 text-destructive",
            (status.status === 'in_progress' || status.status === 'pending') && "bg-primary/10 text-primary"
          )}>
            {status.status === 'in_progress' ? 'Processing' : 
             status.status === 'completed' ? 'Done' : 
             status.status === 'failed' ? 'Failed' : 'Pending'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {status.message || 'Processing document...'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Total Progress</span>
          <span className="text-xs font-mono font-semibold text-foreground">
            {progressPercentage}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              status.status === 'failed' ? "bg-destructive" : "bg-primary"
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stage List */}
      <div className="space-y-3 relative">
        {/* Vertical connector line */}
        <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-border -z-10" />
        
        {STAGES.map((stage, index) => {
          const stageStatus = getStageStatus(stageIndex, index, status.status)
          
          return (
            <div
              key={stage.stage}
              className={cn(
                'flex items-start gap-4 p-3 rounded-lg transition-colors',
                stageStatus === 'in-progress' && 'bg-primary/5',
                stageStatus === 'failed' && 'bg-destructive/5'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5 z-10 ring-4 ring-card', // Added ring for spacing around connector
                  stageStatus === 'complete' && 'bg-emerald-500 text-white',
                  stageStatus === 'in-progress' && 'bg-primary text-primary-foreground',
                  stageStatus === 'failed' && 'bg-destructive text-destructive-foreground',
                  stageStatus === 'pending' && 'bg-secondary text-muted-foreground'
                )}
              >
                {stageStatus === 'complete' && <Check className="w-3.5 h-3.5" />}
                {stageStatus === 'in-progress' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {stageStatus === 'failed' && <AlertCircle className="w-3.5 h-3.5" />}
                {stageStatus === 'pending' && <Circle className="w-2.5 h-2.5 fill-current" />}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      stageStatus === 'complete' && 'text-muted-foreground',
                      stageStatus === 'in-progress' && 'text-foreground',
                      stageStatus === 'failed' && 'text-destructive',
                      stageStatus === 'pending' && 'text-muted-foreground'
                    )}
                  >
                    {stage.label}
                  </p>
                  {stageStatus === 'in-progress' && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary animate-pulse">
                      Active
                    </span>
                  )}
                </div>
                <p 
                  className={cn(
                    "text-xs mt-0.5",
                    stageStatus === 'in-progress' ? "text-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {stage.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Status Message for Errors */}
      {status.status === 'failed' && (
        <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-destructive font-medium">analysis Failed</p>
            <p className="text-xs text-destructive/80 mt-1">
              {status.message || 'An unexpected error occurred during analysis.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
