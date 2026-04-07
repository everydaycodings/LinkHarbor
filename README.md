# ⚓ LinkHarbor

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**LinkHarbor** is a high-performance, privacy-focused, and self-hosted file downloader service. Designed for Dockerized environments, it handles single URL downloads and batch processing with ease, providing a sleek interface for managing your "harbored" files.

---

## ✨ Features

- 🚀 **High Performance**: Built with Next.js and optimized for streaming large files without memory buffering.
- 📦 **Batch Downloads**: Submit multiple URLs at once. LinkHarbor automatically bundles them into a streaming ZIP archive.
- 🔒 **Privacy First**: Jobs are tracked by IP address. Only the downloader can see and manage their own links.
- 🧹 **Auto-Cleanup**: Automated garbage collection removes expired downloads after 24 hours to keep your storage clean.
- 📊 **Real-time Progress**: Visual tracking for each download job and individual files.
- 🐳 **Docker Ready**: One-command deployment with persistent volume support.
- 🎨 **Modern UI**: Powered by Tailwind CSS and Shadcn/UI for a premium, responsive experience.

---

## ⚓ How it Works

LinkHarbor acts as a high-speed relay between restricted networks and fast global content delivery networks.

1. **Submission**: You provide a direct file URL or a `.txt` list of URLs.
2. **Relay**: LinkHarbor's server (ideally on a high-bandwidth VPS) downloads the files into its temporary storage.
3. **Packaging**: If multiple files are requested, they are streamed directly into a ZIP archive.
4. **Acquisition**: You download the file(s) from the LinkHarbor relay at your maximum local connection speed.
5. **Expiry**: 24 hours later, the files are automatically purged to reclaim space.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Backend**: Node.js Web Streams for efficient I/O
- **Storage**: Local filesystem with Docker volume persistence
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

### Quick Start with Docker

1. **Clone the repository**:

   ```bash
   git clone https://github.com/everydaycodings/LinkHarbor.git
   cd LinkHarbor
   ```

2. **Spin up the container**:

   ```bash
   docker-compose up -d
   ```

3. **Access the app**:
   Open [http://localhost:3333](http://localhost:3333) in your browser.

### Environment Variables

| Variable    | Description                     | Default      |
| ----------- | ------------------------------- | ------------ |
| `PORT`      | Container internal port         | `3000`       |
| `DATA_PATH` | Path where downloads are stored | `/data`      |
| `NODE_ENV`  | Environment mode                | `production` |

---

## 📂 Project Structure

```text
LinkHarbor/
├── app/                # Next.js App Router (UI & API)
├── components/         # Shadcn/UI & Custom components
├── lib/                # Core logic (Storage, Downloader, ZIP)
├── public/             # Static assets
├── storage/            # Local dev storage (gitignored)
├── Dockerfile          # Production multi-stage build
└── docker-compose.yml  # Deployment configuration
```

---

## 📦 Local Development

If you want to run LinkHarbor outside of Docker for development:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🛡 Security & Privacy

- **No Database**: LinkHarbor uses the filesystem for metadata, making it lightweight and easy to backup.
- **Client-Only Access**: Downloads are restricted to the IP that initiated them.
- **Stateless**: Easily scale or migrate by simply moving the `/data` volume.

---

## 📝 License

This project is [MIT](LICENSE) licensed.

---

<p align="center">
  Built with ❤️ by <b>EverydayCodings</b>
</p>
