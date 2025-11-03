import { useState } from "react";
import { ChatWindow } from "./components/ChatWindow";
import { ModelSelector } from "./components/ModelSelector";
import type { AIModel } from "@polychat/types";

const availableModels: AIModel[] = [
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "Fast and efficient model"
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "Most capable model"
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Balanced performance"
  }
];

function App() {
  const [selectedModel, setSelectedModel] = useState<AIModel>(availableModels[0]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Polychat</h1>
            <ModelSelector
              models={availableModels}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 py-6">
          <ChatWindow model={selectedModel} />
        </div>
      </main>
    </div>
  );
}

export default App;
