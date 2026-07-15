import Link from "next/link";
import { Code2, MessageSquareText, Network, Search, Bot } from "lucide-react";

const PLAYGROUNDS = [
  { href: "/playground/code", icon: Code2, title: "מעבדת קוד", desc: "עורך קוד חי עם תצוגה מקדימה" },
  { href: "/playground/prompt", icon: MessageSquareText, title: "Prompt Playground", desc: "נסה פרומפטים ולמד הנדסת פרומפט" },
  { href: "/playground/mcp", icon: Network, title: "MCP Playground", desc: "בנה ונסה כלי MCP" },
  { href: "/playground/rag", icon: Search, title: "RAG Playground", desc: "נסה retrieval ו-chunking" },
  { href: "/playground/agent", icon: Bot, title: "Agent Playground", desc: "בנה סוכן AI ובדוק לולאת פעולה" },
];

export const metadata = {
  title: "מעבדות",
  description: "מעבדות אינטראקטיביות: Prompt, קוד, RAG, MCP וסוכנים — התנסות חופשית ללא צורך בשיעור.",
};

export default function PlaygroundIndex() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-extrabold">מעבדות אינטראקטיביות</h1>
      <p className="mt-2 text-muted">התנסות חופשית — לא צריך שיעור כדי לשחק כאן</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PLAYGROUNDS.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
          >
            <p.icon size={22} className="mb-3 text-primary" />
            <div className="font-bold">{p.title}</div>
            <div className="text-sm text-muted">{p.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
