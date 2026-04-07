"use client"

import { useState, useEffect } from "react"
import { JobMetadata } from "@/lib/storage"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Plus, 
  Search, 
  DownloadCloud, 
  Zap, 
  ShieldCheck, 
  Clock, 
  FileText,
  Loader2
} from "lucide-react"

export default function Dashboard() {
  const [urlInput, setUrlInput] = useState("")
  const [jobs, setJobs] = useState<JobMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchJobs = async (silent = false) => {
    if (!silent) setIsRefreshing(true)
    try {
      const res = await fetch("/api/jobs")
      const data = await res.json()
      if (Array.isArray(data)) setJobs(data)
    } catch (err) {
      console.error("Failed to fetch jobs:", err)
    } finally {
      if (!silent) setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchJobs()
    const interval = setInterval(() => fetchJobs(true), 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() })
      })
      
      if (res.ok) {
        setUrlInput("")
        fetchJobs()
      }
    } catch (err) {
      console.error("Failed to create job:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result as string
      const urls = content.split("\n").map(u => u.trim()).filter(u => u.startsWith("http"))
      
      if (urls.length === 0) return

      try {
        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls })
        })
        if (res.ok) fetchJobs()
      } catch (err) {
        console.error("Failed to upload txt:", err)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-background hero-gradient selection:bg-primary/20">
      <header className="border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <DownloadCloud className="h-5.5 w-5.5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              LinkHarbor
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /><span className="hidden xs:inline">High Speed</span></span>
            <span className="hidden sm:flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Secure</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /><span className="hidden xs:inline">24h Expiry</span></span>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight gradient-text leading-tight sm:leading-tight">
            Bypass Slow Networks
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            Download large files instantly using our high-speed VPS relay. 
            Single URLs or bulk .txt imports supported.
          </p>
        </div>

        {/* Input Card */}
        <Card className="glass shadow-2xl border-primary/10 overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 animate-pulse" />
          <CardContent className="p-5 sm:p-10">
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                 <Input 
                   placeholder="Paste file URL here..." 
                   className="pl-12 h-14 text-base bg-background/40 border-border/40 focus-visible:ring-primary/50 shadow-inner rounded-xl"
                   value={urlInput}
                   onChange={(e) => setUrlInput(e.target.value)}
                 />
               </div>
               <div className="flex flex-row gap-3">
                 <Button 
                   type="submit" 
                   disabled={isLoading || !urlInput.trim()} 
                   className="h-14 flex-1 text-base font-bold shadow-xl shadow-primary/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                 >
                   {isLoading ? (
                     <Loader2 className="h-5 w-5 animate-spin" />
                   ) : (
                     <><Plus className="h-5 w-5 mr-2" /> Fetch URL</>
                   )}
                 </Button>
                 <div className="relative">
                   <Input 
                     type="file" 
                     accept=".txt" 
                     className="hidden" 
                     id="file-upload" 
                     onChange={handleFileUpload}
                   />
                   <Button 
                     asChild 
                     variant="outline" 
                     className="h-14 w-14 p-0 shadow-sm border-border/40 bg-secondary/20 hover:bg-secondary/40 rounded-xl transition-all"
                   >
                     <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center">
                        <FileText className="h-6 w-6" />
                     </label>
                   </Button>
                 </div>
               </div>
             </form>
             <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
               <div className="h-px w-8 bg-border/40" />
               <span>Supported formats: Single URL or .txt list</span>
               <div className="h-px w-8 bg-border/40" />
             </div>
          </CardContent>
        </Card>

        {/* Jobs Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Recent Jobs
              {isRefreshing && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </h3>
            <div className="text-xs text-muted-foreground">
              {jobs.length} Active Jobs
            </div>
          </div>

          <div className="grid gap-4">
            {jobs.length > 0 ? (
              jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed rounded-xl bg-muted/20 border-border/50">
                <DownloadCloud className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">No active jobs yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Submit a URL to start accelerating your downloads.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="py-12 border-t mt-20">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>© 2026 LinkHarbor. High-speed file relay service.</p>
          <p className="mt-2">Files are automatically deleted after 24 hours.</p>
        </div>
      </footer>
    </div>
  )
}
