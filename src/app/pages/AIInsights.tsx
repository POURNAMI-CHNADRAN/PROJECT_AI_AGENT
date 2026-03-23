import { Brain, Send, Sparkles } from "lucide-react";

const sampleQuestions = [
  "Which employees will become non-billable next month?",
  "What is the current resource utilization by department?",
  "Which projects have the highest revenue?",
  "Identify employees with underutilized capacity",
  "Predict bench resources for next quarter",
];

const aiResponse = {
  question: "Which employees will become non-billable next month?",
  answer: "Based on current project allocations and end dates, the following employees are at risk of becoming non-billable in April 2026:",
  insights: [
    { employee: "Michael Chen", currentProject: "Data Analytics Dashboard", endDate: "2026-03-31", allocation: "80%", recommendation: "Allocate to new project or internal training" },
    { employee: "Emily Davis", currentProject: "Mobile App Redesign", endDate: "2026-05-15", allocation: "100%", recommendation: "Consider for Cloud Migration shadow allocation" },
  ]
};

export default function AIInsights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-neutral-700" />
        <h1 className="text-neutral-800">AI Insights</h1>
      </div>

      {/* AI Query Box */}
      <div className="bg-white border-2 border-neutral-300 p-6 rounded">
        <h2 className="text-neutral-800 mb-4">Ask AI Assistant</h2>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Ask a question about resource utilization, billing, or forecasting..."
            className="flex-1 px-4 py-3 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
          <button className="flex items-center gap-2 px-6 py-3 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
            <Send className="w-4 h-4" />
            Ask AI
          </button>
        </div>

        {/* Sample Questions */}
        <div>
          <p className="text-sm text-neutral-600 mb-3">Sample questions:</p>
          <div className="space-y-2">
            {sampleQuestions.map((question) => (
              <button
                key={question}
                className="block w-full text-left px-4 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-sm text-neutral-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Response Card */}
      <div className="bg-white border-2 border-neutral-300 rounded overflow-hidden">
        <div className="px-6 py-4 bg-neutral-100 border-b-2 border-neutral-300 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-neutral-600" />
          <h2 className="text-neutral-800">AI Response</h2>
        </div>

        <div className="p-6">
          <div className="mb-4 pb-4 border-b border-neutral-200">
            <p className="text-sm text-neutral-600 mb-2">Question:</p>
            <p className="text-neutral-800">{aiResponse.question}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-neutral-600 mb-2">Answer:</p>
            <p className="text-neutral-800">{aiResponse.answer}</p>
          </div>

          {/* Insights Table */}
          <div className="border-2 border-neutral-300 rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-100 border-b-2 border-neutral-300">
                  <th className="text-left px-4 py-3 text-sm text-neutral-700">Employee</th>
                  <th className="text-left px-4 py-3 text-sm text-neutral-700">Current Project</th>
                  <th className="text-left px-4 py-3 text-sm text-neutral-700">End Date</th>
                  <th className="text-left px-4 py-3 text-sm text-neutral-700">Allocation</th>
                  <th className="text-left px-4 py-3 text-sm text-neutral-700">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {aiResponse.insights.map((insight, index) => (
                  <tr key={index} className="border-b border-neutral-200">
                    <td className="px-4 py-3 text-sm text-neutral-800">{insight.employee}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{insight.currentProject}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{insight.endDate}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{insight.allocation}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{insight.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-neutral-400" />
            <h3 className="text-sm text-neutral-700">Utilization Trend</h3>
          </div>
          <p className="text-2xl text-neutral-800 mb-1">↑ 5%</p>
          <p className="text-sm text-neutral-600">from last month</p>
        </div>

        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-neutral-400" />
            <h3 className="text-sm text-neutral-700">Bench Forecast</h3>
          </div>
          <p className="text-2xl text-neutral-800 mb-1">12 employees</p>
          <p className="text-sm text-neutral-600">predicted for April</p>
        </div>

        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-neutral-400" />
            <h3 className="text-sm text-neutral-700">Top Performer</h3>
          </div>
          <p className="text-2xl text-neutral-800 mb-1">Engineering</p>
          <p className="text-sm text-neutral-600">highest utilization</p>
        </div>
      </div>
    </div>
  );
}
