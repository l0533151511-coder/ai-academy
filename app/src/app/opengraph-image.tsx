import { ImageResponse } from "next/og";

// תמונת שיתוף חברתי (OG/Twitter) 1200x630. טקסט לטיני בלבד — הפונט המובנה של ImageResponse
// אינו כולל גליפים עבריים, ולכן עברית הייתה מרונדרת כריבועים. השם המותגי הלטיני בטוח ועקבי.
export const runtime = "edge";
export const alt = "AI Academy — build real AI systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b1120 0%, #1e1b4b 60%, #312e81 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 22,
              background: "#5b5bf6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 46,
            }}
          >
            🎓
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, opacity: 0.9 }}>AI Academy</div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
          Build real AI systems.
        </div>
        <div style={{ fontSize: 34, marginTop: 24, color: "#c7d2fe", maxWidth: 900 }}>
          Claude Code · Prompt Engineering · RAG · Agents · Production
        </div>
        <div style={{ fontSize: 26, marginTop: 40, color: "#94a3b8" }}>
          Project-based · Hebrew · zero to production
        </div>
      </div>
    ),
    size
  );
}
