"use client"

import { GithubLogo, Globe, Heart, ArrowSquareOut, CloudArrowDown } from "@phosphor-icons/react"

export function Footer() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-md mt-20">
      <div className="container max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <CloudArrowDown size={20} weight="fill" />
              </div>
              <span className="text-lg font-bold tracking-tight">LinkHarbor</span>
            </div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xs">
              A high-speed file relay and downloader designed to bypass network restrictions and accelerate your digital life.
              Secure, fast, and simple.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
              <Heart size={14} className="text-red-500" weight="fill" />
              <span>Crafted with passion for the open-source community.</span>
            </div>
          </div>

          {/* Project Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Project</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/everydaycodings/LinkHarbor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <GithubLogo size={18} className="group-hover:scale-110 transition-transform" />
                  Source Code
                  <ArrowSquareOut size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li className="text-xs text-muted-foreground/60 italic pt-1">
                Files are auto-deleted after 24 hours.
              </li>
            </ul>
          </div>

          {/* Author Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Author</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/everydaycodings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <GithubLogo size={18} className="group-hover:scale-110 transition-transform" />
                  @everydaycodings
                </a>
              </li>
              <li>
                <a
                  href="https://everydaycodings.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe size={18} className="group-hover:scale-110 transition-transform" />
                  everydaycodings.com
                  <ArrowSquareOut size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60">
          <p>© 2026 LinkHarbor. Distributed under MIT License.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-foreground cursor-default transition-colors">Privacy Priority</span>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <span className="hover:text-foreground cursor-default transition-colors">Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
