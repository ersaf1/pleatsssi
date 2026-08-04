# User Taste
- Communicates in Bahasa Indonesia; expects responses in Indonesian. Confidence: 0.9
- Gives very detailed briefs with full context (what's done, data structures, exact next steps) and expects them followed precisely. Confidence: 0.8
- Proactively surfaces tradeoff decisions (e.g. fidelity vs. speed) as questions and wants to be consulted before the assistant picks an approach. Confidence: 0.7
- Wants a todo list created first, tasks executed sequentially, and the build run only at the end ("Buat todo list dulu, kerjakan berurutan, bangun di akhir"). Confidence: 0.9
- Expects verification after implementation: `npm run build` must succeed, then manually QA every route (HTTP status + content checks) with no 404s. Confidence: 0.85
- Works on Windows (paths like C:\Users\lulus\...); shell commands must be Windows-compatible (PowerShell, not bash loops). Confidence: 0.8
- Next.js builds must use Webpack only — SWC is broken on this machine. Use `npm run build` as-is (flags already baked into package.json); never append `--webpack` manually. Confidence: 0.9
- Web stack of choice: Next.js (App Router) + Tailwind CSS v4 + TypeScript strict mode. Confidence: 0.8
