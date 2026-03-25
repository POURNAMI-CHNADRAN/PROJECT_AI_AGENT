import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "AI not responding 😢" },
      ]);
    }

    setInput("");
  };

  return (
    <>
      {/* Floating Premium Button */}
      <div
        className="
          fixed bottom-6 right-6 bg-gradient-to-br from-sky-500 to-sky-700 
          text-white p-4 rounded-full shadow-xl cursor-pointer 
          hover:scale-110 active:scale-95 transition-all duration-300
        "
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </div>

      {/* Chat Window */}
      {open && (
        <div
          className="
            fixed bottom-24 right-6 w-80 backdrop-blur-xl 
            bg-white/70 shadow-2xl rounded-2xl flex flex-col 
            border border-white/30 animate-fadeIn
          "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-sky-500 text-white p-4 font-semibold text-lg rounded-t-2xl shadow">
            AI Assistant
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 max-h-96"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`
                  max-w-[85%] px-3 py-2 rounded-xl text-sm shadow-sm 
                  ${
                    m.role === "user"
                      ? "bg-sky-600 text-white ml-auto rounded-br-none"
                      : "bg-white text-sky-900 mr-auto border border-sky-100 rounded-bl-none"
                  }
                `}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-sky-100 flex items-center gap-2 bg-white/80 backdrop-blur">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="
                flex-1 border border-sky-300 rounded-xl px-3 py-2 text-sm 
                focus:border-sky-500 focus:ring-2 focus:ring-sky-300 
                outline-none shadow-sm
              "
              placeholder="Ask something..."
            />

            <button
              onClick={sendMessage}
              className="
                bg-sky-600 text-white p-2 rounded-xl 
                hover:bg-sky-700 transition shadow
              "
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}