const MAX_CHUNK = 450;

function splitIntoChunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const s of sentences) {
    if ((current + s).length > MAX_CHUNK) {
      if (current) chunks.push(current);
      current = s;
    } else {
      current += s;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translateChunk(text: string, from: "en" | "es", to: "en" | "es"): Promise<string> {
  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=${from}|${to}`);
  const data = await res.json();
  return data?.responseData?.translatedText || text;
}

export async function translateText(text: string, from: "en" | "es", to: "en" | "es"): Promise<string> {
  if (from === to) return text;
  try {
    const chunks = splitIntoChunks(text);
    const translated = await Promise.all(chunks.map(c => translateChunk(c, from, to)));
    return translated.join(" ");
  } catch {
    return text;
  }
}
