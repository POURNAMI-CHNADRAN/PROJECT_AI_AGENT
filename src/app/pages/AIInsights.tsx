// import { Brain, Send, Sparkles } from "lucide-react";

// const sampleQuestions = [
//   "Which employees will become non-billable next month?",
//   "What is the current resource utilization by department?",
//   "Which projects have the highest revenue?",
//   "Identify employees with underutilized capacity",
//   "Predict bench resources for next quarter",
// ];

// const aiResponse = {
//   question: "Which employees will become non-billable next month?",
//   answer: "Based on current project allocations and end dates, the following employees are at risk of becoming non-billable in April 2026:",
//   insights: [
//     { employee: "Michael Chen", currentProject: "Data Analytics Dashboard", endDate: "2026-03-31", allocation: "80%", recommendation: "Allocate to new project or internal training" },
//     { employee: "Emily Davis", currentProject: "Mobile App Redesign", endDate: "2026-05-15", allocation: "100%", recommendation: "Consider for Cloud Migration shadow allocation" },
//   ]
// };

// export default function AIInsights() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-3">
//         <Brain className="w-8 h-8 text-neutral-700" />
//         <h1 className="text-neutral-800">AI Insights</h1>
//       </div>

//       {/* AI Query Box */}
//       <div className="bg-white border-2 border-neutral-300 p-6 rounded">
//         <h2 className="text-neutral-800 mb-4">Ask AI Assistant</h2>
//         <div className="flex gap-3 mb-4">
//           <input
//             type="text"
//             placeholder="Ask a question about resource utilization, billing, or forecasting..."
//             className="flex-1 px-4 py-3 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
//           />
//           <button className="flex items-center gap-2 px-6 py-3 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
//             <Send className="w-4 h-4" />
//             Ask AI
//           </button>
//         </div>

//         {/* Sample Questions */}
//         <div>
//           <p className="text-sm text-neutral-600 mb-3">Sample questions:</p>
//           <div className="space-y-2">
//             {sampleQuestions.map((question) => (
//               <button
//                 key={question}
//                 className="block w-full text-left px-4 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-sm text-neutral-700 transition-colors"
//               >
//                 {question}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* AI Response Card */}
//       <div className="bg-white border-2 border-neutral-300 rounded overflow-hidden">
//         <div className="px-6 py-4 bg-neutral-100 border-b-2 border-neutral-300 flex items-center gap-2">
//           <Sparkles className="w-5 h-5 text-neutral-600" />
//           <h2 className="text-neutral-800">AI Response</h2>
//         </div>

//         <div className="p-6">
//           <div className="mb-4 pb-4 border-b border-neutral-200">
//             <p className="text-sm text-neutral-600 mb-2">Question:</p>
//             <p className="text-neutral-800">{aiResponse.question}</p>
//           </div>

//           <div className="mb-4">
//             <p className="text-sm text-neutral-600 mb-2">Answer:</p>
//             <p className="text-neutral-800">{aiResponse.answer}</p>
//           </div>

//           {/* Insights Table */}
//           <div className="border-2 border-neutral-300 rounded overflow-hidden">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-neutral-100 border-b-2 border-neutral-300">
//                   <th className="text-left px-4 py-3 text-sm text-neutral-700">Employee</th>
//                   <th className="text-left px-4 py-3 text-sm text-neutral-700">Current Project</th>
//                   <th className="text-left px-4 py-3 text-sm text-neutral-700">End Date</th>
//                   <th className="text-left px-4 py-3 text-sm text-neutral-700">Allocation</th>
//                   <th className="text-left px-4 py-3 text-sm text-neutral-700">Recommendation</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {aiResponse.insights.map((insight, index) => (
//                   <tr key={index} className="border-b border-neutral-200">
//                     <td className="px-4 py-3 text-sm text-neutral-800">{insight.employee}</td>
//                     <td className="px-4 py-3 text-sm text-neutral-600">{insight.currentProject}</td>
//                     <td className="px-4 py-3 text-sm text-neutral-600">{insight.endDate}</td>
//                     <td className="px-4 py-3 text-sm text-neutral-600">{insight.allocation}</td>
//                     <td className="px-4 py-3 text-sm text-neutral-600">{insight.recommendation}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Additional Insights */}
//       <div className="grid grid-cols-3 gap-4">
//         <div className="bg-white border-2 border-neutral-300 p-6 rounded">
//           <div className="flex items-center gap-2 mb-3">
//             <Sparkles className="w-5 h-5 text-neutral-400" />
//             <h3 className="text-sm text-neutral-700">Utilization Trend</h3>
//           </div>
//           <p className="text-2xl text-neutral-800 mb-1">↑ 5%</p>
//           <p className="text-sm text-neutral-600">from last month</p>
//         </div>

//         <div className="bg-white border-2 border-neutral-300 p-6 rounded">
//           <div className="flex items-center gap-2 mb-3">
//             <Sparkles className="w-5 h-5 text-neutral-400" />
//             <h3 className="text-sm text-neutral-700">Bench Forecast</h3>
//           </div>
//           <p className="text-2xl text-neutral-800 mb-1">12 employees</p>
//           <p className="text-sm text-neutral-600">predicted for April</p>
//         </div>

//         <div className="bg-white border-2 border-neutral-300 p-6 rounded">
//           <div className="flex items-center gap-2 mb-3">
//             <Sparkles className="w-5 h-5 text-neutral-400" />
//             <h3 className="text-sm text-neutral-700">Top Performer</h3>
//           </div>
//           <p className="text-2xl text-neutral-800 mb-1">Engineering</p>
//           <p className="text-sm text-neutral-600">highest utilization</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import axios from "axios";
// import { Send } from "lucide-react";

// export default function AIInsights() {
//   const [question, setQuestion] = useState("");
//   const [response, setResponse] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const askAI = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:5000/api/ai/ask",
//         { question }
//       );

//       setResponse(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-sky-50 min-h-screen p-6 space-y-6">

//       <h1 className="text-2xl font-bold text-sky-900">
//         AI Insights (Enterprise)
//       </h1>

//       {/* INPUT */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <div className="flex gap-3">
//           <input
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             className="flex-1 p-3 border rounded"
//             placeholder="Ask AI..."
//           />
//           <button
//             onClick={askAI}
//             className="bg-sky-600 text-white px-4 py-2 rounded flex gap-2"
//           >
//             <Send className="w-4 h-4" />
//             Ask
//           </button>
//         </div>
//       </div>

//       {/* RESPONSE */}
//       {loading ? (
//         <p>Thinking...</p>
//       ) : response && (
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h2 className="font-semibold mb-2">Answer</h2>
//           <p className="mb-4">{response.answer}</p>

//           {response.insights.length > 0 && (
//             <table className="w-full border">
//               <thead className="bg-sky-100">
//                 <tr>
//                   {Object.keys(response.insights[0]).map((key) => (
//                     <th key={key} className="p-2 text-left">
//                       {key}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {response.insights.map((row: any, i: number) => (
//                   <tr key={i} className="border-b">
//                     {Object.values(row).map((val: any, j) => (
//                       <td key={j} className="p-2">
//                         {val}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";
import { Brain, Send, Sparkles } from "lucide-react";

/* ================= SAMPLE QUESTIONS ================= */

const sampleQuestions = [
  "Which employees will become non-billable next month?",
  "What is the current resource utilization?",
  "Which projects have the highest revenue?",
  "Identify employees with underutilized capacity",
  "Who is on bench?",
];

/* ================= COMPONENT ================= */

export default function AIInsights() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /* ================= ASK AI ================= */

  const askAI = async (q?: string) => {
    try {
      const finalQuestion = q || question;

      if (!finalQuestion) return;

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/ai/ask",
        { question: finalQuestion }
      );

      setResponse({
        question: finalQuestion,
        ...res.data
      });

      setQuestion("");
    } catch (err) {
      console.error("AI ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-sky-50 min-h-screen p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-sky-700" />
        <h1 className="text-2xl font-bold text-sky-900">
          AI Insights
        </h1>
      </div>

      {/* ASK AI BOX */}
      <div className="bg-white border border-sky-200 p-6 rounded-xl shadow-sm">
        <h2 className="text-sky-900 font-semibold mb-4">
          Ask AI Assistant
        </h2>

        <div className="flex gap-3 mb-4">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about utilization, revenue, bench..."
            className="flex-1 px-4 py-3 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <button
            onClick={() => askAI()}
            className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700 transition"
          >
            <Send className="w-4 h-4" />
            Ask
          </button>
        </div>

        {/* SAMPLE QUESTIONS */}
        <div>
          <p className="text-sm text-sky-600 mb-2">
            Try asking:
          </p>

          <div className="space-y-2">
            {sampleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => askAI(q)}
                className="block w-full text-left px-4 py-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded text-sm text-sky-800 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESPONSE */}
      {loading ? (
        <div className="bg-white p-6 rounded-xl shadow text-sky-700">
          🤖 Thinking...
        </div>
      ) : response && (
        <div className="bg-white border border-sky-200 rounded-xl overflow-hidden shadow-sm">

          {/* HEADER */}
          <div className="px-6 py-4 bg-sky-100 border-b border-sky-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-600" />
            <h2 className="text-sky-900 font-semibold">
              AI Response
            </h2>
          </div>

          <div className="p-6">

            {/* QUESTION */}
            <div className="mb-4 pb-4 border-b border-sky-200">
              <p className="text-sm text-sky-600 mb-1">Question:</p>
              <p className="text-sky-900">{response.question}</p>
            </div>

            {/* ANSWER */}
            <div className="mb-4">
              <p className="text-sm text-sky-600 mb-1">Answer:</p>
              <p className="text-sky-900">{response.answer}</p>
            </div>

            {/* INSIGHTS TABLE */}
            {response.insights?.length > 0 && (
              <div className="border border-sky-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-sky-100 border-b border-sky-200">
                      {Object.keys(response.insights[0]).map((key) => (
                        <th key={key} className="text-left px-4 py-3 text-sky-800 capitalize">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {response.insights.map((row: any, i: number) => (
                      <tr key={i} className="border-b border-sky-100">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="px-4 py-3 text-sky-700">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* EMPTY STATE */}
            {response.insights?.length === 0 && (
              <p className="text-sky-600 italic">
                No structured insights available for this query.
              </p>
            )}
          </div>
        </div>
      )}

      {/* EXTRA CARDS */}
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-white border border-sky-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm text-sky-700">Utilization Trend</h3>
          </div>
          <p className="text-2xl text-sky-900">↑ 5%</p>
          <p className="text-sm text-sky-600">vs last month</p>
        </div>

        <div className="bg-white border border-sky-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm text-sky-700">Bench Forecast</h3>
          </div>
          <p className="text-2xl text-sky-900">Dynamic</p>
          <p className="text-sm text-sky-600">Ask AI to predict</p>
        </div>

        <div className="bg-white border border-sky-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm text-sky-700">Top Insight</h3>
          </div>
          <p className="text-2xl text-sky-900">AI Driven</p>
          <p className="text-sm text-sky-600">Real-time analytics</p>
        </div>

      </div>
    </div>
  );
}