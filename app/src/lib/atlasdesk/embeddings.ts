// שכבת embeddings משותפת ל-AtlasDesk — משמשת גם בחיפוש סמנטי (embeddings-vector-db)
// וגם ב-RAG (rag). מפוצל לקובץ נפרד כדי למנוע שכפול קוד בין שני ה-API routes.

interface EmbeddingResponse {
  data: { embedding: number[] }[];
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function embed(texts: string[], apiKey: string): Promise<number[][]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "text-embedding-3-small", input: texts }),
  });
  if (!res.ok) throw new Error(`OpenAI embeddings API error: ${res.status}`);
  const data = (await res.json()) as EmbeddingResponse;
  return data.data.map((d) => d.embedding);
}
