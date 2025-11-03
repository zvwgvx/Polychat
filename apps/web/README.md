# Polychat Web

Frontend application for Polychat built with Vite + React + TypeScript.

## Setup

1. Install dependencies from the root directory:
```bash
cd ../../  # Go to root
pnpm install
```

## Development

Run the development server:
```bash
pnpm dev
```

Or from the root directory:
```bash
pnpm --filter @polychat/web dev
```

The app will be available at http://localhost:3000

## Build

Build for production:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

## Features

- Real-time chat interface
- Multiple AI model selection
- Responsive design with Tailwind CSS
- Shared UI components from `@polychat/ui`
- Type-safe with TypeScript

## Project Structure

```
src/
├── components/
│   ├── ChatWindow.tsx    # Main chat interface
│   └── ModelSelector.tsx # AI model selection
├── App.tsx              # Main application
├── main.tsx            # Entry point
└── index.css           # Global styles
```
