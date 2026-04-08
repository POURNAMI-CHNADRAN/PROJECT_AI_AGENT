interface MoveSuggestion {
  employee: string;
  project: string;
  suggestedHours: number;
  reason: string;
  confidence: number;
}

interface SuggestionPanelProps {
  suggestions: MoveSuggestion[];
}

export function SuggestionPanel({
  suggestions,
}: SuggestionPanelProps) {
  if (!suggestions.length) return null;

  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="p-4 font-semibold">Suggested Moves</h2>

      {suggestions.map((s) => (
        <div
          key={`${s.employee}-${s.project}`}
          className="flex justify-between p-3 border-t"
        >
          <div>
            <div className="font-medium text-gray-900">
              {s.employee}
            </div>

            <div className="text-sm text-gray-500">
              → {s.project} ({s.suggestedHours}h)
            </div>

            <div className="text-xs text-gray-400">
              {s.reason}
            </div>
          </div>

          <div className="text-green-600 font-medium">
            {Math.round(s.confidence * 100)}%
          </div>
        </div>
      ))}
    </div>
  );
}