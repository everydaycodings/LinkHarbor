"use client"

import { JobMetadata } from "@/lib/storage"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Download, FileIcon, Loader2, AlertCircle, CheckCircle2, Archive } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface JobCardProps {
  job: JobMetadata
}

export function JobCard({ job }: JobCardProps) {
  const isCompleted = job.status === "completed"
  const isFailed = job.status === "failed"
  const isProcessing = ["downloading", "zipping", "pending"].includes(job.status)

  const getStatusBadge = () => {
    switch (job.status) {
      case "completed": return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Ready</Badge>
      case "failed": return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Failed</Badge>
      case "zipping": return <Badge variant="warning" className="gap-1 animate-pulse"><Archive className="h-3 w-3" /> Zipping</Badge>
      case "downloading": return <Badge variant="default" className="gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Fetching</Badge>
      default: return <Badge variant="secondary">Pending</Badge>
    }
  }

  const totalProgress = job.files.reduce((acc, f) => acc + f.progress, 0) / job.files.length

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border-border/40 group bg-card/50 backdrop-blur-sm rounded-2xl">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="mt-1 h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              {job.isZip ? <Archive className="h-6 w-6" /> : <FileIcon className="h-6 w-6" />}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="font-bold text-base sm:text-lg truncate tracking-tight text-foreground/90">
                {job.isZip ? `Bundle (${job.files.length} files)` : job.files[0].name}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
                  {formatDistanceToNow(job.createdAt, { addSuffix: true })}
                </span>
                <div className="h-1 w-1 rounded-full bg-border/60" />
                {getStatusBadge()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isCompleted && (
              <Button asChild size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/10 rounded-xl font-semibold gap-2 border-b-4 border-primary-foreground/10 active:border-b-0 active:translate-y-1 transition-all">
                <a href={`/api/download/${job.id}`} download>
                  <Download className="h-4.5 w-4.5" /> Download
                </a>
              </Button>
            )}
            {isFailed && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                <AlertCircle className="h-4 w-4" /> {job.error || "Failed to fetch"}
              </div>
            )}
          </div>
        </div>

        {isProcessing && (
          <div className="mt-6 space-y-3 bg-secondary/10 p-4 rounded-xl border border-border/30">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
              <span>Overall Progress</span>
              <span className="text-primary">{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2 bg-secondary/40" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              {job.files.map((file, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-xl bg-background/60 border border-border/20 text-[10px] sm:text-xs shadow-sm">
                   <div className="flex justify-between items-center gap-2">
                     <span className="truncate font-medium text-foreground/80">{file.name}</span>
                     <span className={`font-bold ${file.status === 'failed' ? 'text-destructive' : 'text-primary'}`}>
                       {file.status === 'completed' ? 'Done' : `${file.progress}%`}
                     </span>
                   </div>
                   <Progress value={file.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
