import type { AIModel } from "@polychat/types";

interface ModelSelectorProps {
  models: AIModel[];
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onModelChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="model-select" className="text-sm font-medium text-gray-700">
        Model:
      </label>
      <select
        id="model-select"
        value={selectedModel.id}
        onChange={(e) => {
          const model = models.find((m) => m.id === e.target.value);
          if (model) onModelChange(model);
        }}
        className="block rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} ({model.provider})
          </option>
        ))}
      </select>
    </div>
  );
};
