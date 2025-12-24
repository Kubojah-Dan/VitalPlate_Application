import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { apiFetch } from "../apiClient";
import { useAuth } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MealChatbot = ({ plan }) => {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 **Hi! Ask me anything about your meal plan.**" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const bottomRef = useRef(null);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/chat/meal-chat", {
        method: "POST",
        token,
        body: {
        question: input,
        plan,
        },
     });
      setMessages((m) => [
        ...m,
        { role: "assistant", content: res.answer },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "❌ Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-xl hover:bg-emerald-500 z-50"
      >
        {open ? <X /> : <MessageCircle />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 w-[420px] h-[520px] bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col z-50">

          <div className="p-4 border-b border-slate-800 font-semibold text-white">
            VitalPlate Assistant 🤖
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[90%] ${
                  m.role === "user"
                    ? "bg-emerald-600 text-white ml-auto"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
              </div>
            ))}
            {loading && <p className="text-slate-400">Thinking…</p>}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-slate-800 flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your meals..."
              className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg outline-none"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={async () => {
                if (!input.trim()) return;
                setSearchLoading(true);
                try {
                  const res = await apiFetch('/api/chat/search', { method: 'POST', token, body: { q: input, top: 5 } });
                  setSuggestions(res.results || []);
                } catch (e) {
                  console.error(e);
                } finally { setSearchLoading(false); }
              }}
              className="bg-slate-700 px-3 rounded-lg text-white"
            >
              🔍
            </button>
            <button
              onClick={sendMessage}
              className="bg-emerald-600 px-3 rounded-lg text-white"
            >
              <Send size={16} />
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="p-3 border-t border-slate-800 max-h-48 overflow-auto">
              <div className="text-sm text-slate-400 mb-2">Related snippets</div>
              {suggestions.map((s, i) => (
                <div key={i} className="p-2 rounded hover:bg-slate-800/40 cursor-pointer mb-1">
                  <div className="text-xs text-slate-400">Score: {(s.score||0).toFixed(3)}</div>
                  <div className="text-sm" onClick={()=>{
                    setInput(s.content);
                    setSuggestions([]);
                  }}>{s.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MealChatbot;

