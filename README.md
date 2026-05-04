# JCT SBC/Q 2024 — Learning Programme

Interactive learning modules for the JCT Standard Building Contract With Quantities 2024, built with React and Vite.

## Modules

| # | Module | Status |
|---|--------|--------|
| 1 | Introduction & When to Use It | ✅ Available |
| 2 | Contract Structure & Key Documents | 🔜 Coming soon |
| 3 | The Contract Administrator | ✅ Available |
| 4 | Contractor's Obligations | 🔜 Coming soon |
| 5 | Control of the Works | 🔜 Coming soon |
| 6 | Payment | ✅ Available |
| 7–12 | Extensions of Time, Variations, PC & Defects, Insurance, Termination, Dispute Resolution | 🔜 Coming soon |

Each available module includes interactive exercises (drag-to-sort, predict-and-reveal, calculation challenges) and a practice simulator.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later

### Install & Run Locally

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`. Changes to `.jsx` files are reflected instantly.

### Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder — static HTML, CSS, and JS files ready to deploy anywhere.

### Preview the Production Build

```bash
npm run preview
```

## Deployment

The production build (`dist/`) is a static site. Deploy it to any static hosting provider:

### Netlify

1. Push this project to a GitHub repository
2. Go to [netlify.com](https://www.netlify.com/) → "Add new site" → "Import an existing project"
3. Connect your GitHub repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click "Deploy"

Netlify will auto-deploy on every push to your main branch.

### Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com/) → "Add New Project" → import the repo
3. Vercel auto-detects Vite — just click "Deploy"

### GitHub Pages

Add this to `vite.config.js` (set `base` to your repo name):

```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
})
```

Then build and deploy the `dist/` folder using GitHub Actions or `gh-pages`.

## Project Structure

```
jct-modules/
├── index.html                          # Entry point
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                        # React root
    ├── index.css                       # Minimal reset
    ├── App.jsx                         # Router (Landing + 3 modules)
    ├── Landing.jsx                     # Module selection landing page
    └── modules/
        ├── Module1_Introduction.jsx    # Module 1: Introduction & When to Use It
        ├── Module3_ContractAdministrator.jsx  # Module 3: The Contract Administrator
        └── Module6_Payment.jsx         # Module 6: Payment
```

## Adding New Modules

1. Create a new `.jsx` file in `src/modules/` following the existing pattern
2. Add a route in `src/App.jsx`
3. Add the module card to the `MODULES` array in `src/Landing.jsx` (change its `status` to `"available"` and set its `path`)

## Technology

- **Vite** — build tool and dev server
- **React Router** — client-side routing
- No CSS framework — all styling is inline, matching the original module design
