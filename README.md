# 📚 Interview Prep Hub

A comprehensive, searchable interview preparation website built with [Docusaurus](https://docusaurus.io/). Covers everything you need to crack full-stack developer interviews.

## 🔗 Live Site

> Coming soon — deploy to GitHub Pages or Vercel

---

## 📖 Topics Covered

| Category       | Topics                                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **JavaScript** | Execution context, hoisting, closures, scope, async/await, event loop, promises, higher-order functions, `this` keyword |
| **React**      | Hooks, component lifecycle, Redux Toolkit, interview Q&A                                                                |
| **Backend**    | How Node.js works, HTTP status codes, Kafka basics, SSH                                                                 |
| **Database**   | SQL vs NoSQL, database transactions                                                                                     |
| **Cloud**      | Horizontal vs vertical scaling                                                                                          |
| **DSA**        | Operators and problem patterns                                                                                          |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

Starts the dev server at [http://localhost:3000](http://localhost:3000). Changes are reflected live without restarting.

### Build for Production

```bash
npm run build
```

Generates static output into the `build/` directory, ready to deploy to any static hosting service.

### Serve Production Build Locally

```bash
npm run serve
```

---

## 🗂️ Project Structure

```
Interview-Questions/
├── docs/                   # All documentation / interview prep content
│   ├── javascript/         # 20 JavaScript topics
│   ├── react/              # React, Hooks, Redux
│   ├── backend/            # Node.js, HTTP, Kafka, SSH
│   │   └── Kafka/
│   ├── database/           # SQL vs NoSQL, Transactions
│   ├── cloud/              # Scaling strategies
│   └── dsa/                # Data structures & algorithms
├── src/
│   ├── components/         # Custom React components
│   ├── css/custom.css      # Global styles & theme overrides
│   └── pages/              # Custom pages (homepage)
├── static/                 # Static assets (images, favicon)
├── Data/                   # Original source markdown files
├── scripts/                # Utility scripts
├── docusaurus.config.js    # Site configuration
└── sidebars.js             # Sidebar auto-generated from filesystem
```

---

## 🛠️ Built With

- [Docusaurus 3](https://docusaurus.io/) — Static site generator
- [React 19](https://react.dev/) — UI framework
- [Prism](https://prismjs.com/) — Syntax highlighting
- [Inter](https://fonts.google.com/specimen/Inter) — Typography

---

## 🤝 Contributing

Contributions, additions, and corrections are welcome!

1. Fork the repo
2. Add your notes under the relevant `docs/` category
3. Submit a pull request
