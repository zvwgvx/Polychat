# Polychat

A modern, beautiful chat interface inspired by Claude, built with React, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Clean, professional UI with smooth animations
- **Real-time Streaming**: Stream responses from your AI API
- **Markdown Support**: Full markdown rendering with syntax highlighting
- **Responsive**: Works beautifully on all screen sizes
- **Fast**: Built with Vite for lightning-fast development and builds
- **Type-safe**: Written in TypeScript for better developer experience

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Markdown** - Markdown rendering
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Polychat
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API configuration:
```env
VITE_API_URL=http://localhost:3000/api
VITE_API_KEY=your-api-key-here
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Integration

The chat interface expects your API server to have a `/chat` endpoint that accepts POST requests with the following format:

```typescript
{
  "messages": [
    {
      "role": "user" | "assistant",
      "content": "string"
    }
  ],
  "stream": boolean
}
```

### Streaming Response

For streaming responses, the API should return Server-Sent Events (SSE) with the following format:

```
data: {"content": "chunk of text"}
data: {"content": "another chunk"}
data: [DONE]
```

### Non-streaming Response

For non-streaming responses, return JSON:

```json
{
  "message": "The complete response"
}
```

## Project Structure

```
Polychat/
├── src/
│   ├── components/        # React components
│   │   ├── Chat.tsx      # Main chat container
│   │   ├── Message.tsx   # Individual message component
│   │   ├── ChatInput.tsx # Input area
│   │   ├── Header.tsx    # App header
│   │   └── EmptyState.tsx # Welcome screen
│   ├── store/            # State management
│   │   └── chatStore.ts  # Zustand store
│   ├── services/         # API services
│   │   └── api.ts        # API client
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Customization

### Colors

Edit `tailwind.config.js` to customize the color palette. The current theme uses warm, professional tones inspired by Claude's design.

### API Client

Modify `src/services/api.ts` to adjust how the app communicates with your backend.

### Components

All components are in `src/components/` and can be easily customized to fit your needs.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
