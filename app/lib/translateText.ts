const MAX_CHUNK = 450;

// Spanish-only characters are a near-certain signal on their own; stopwords
// break the tie otherwise. This exists because the submitted "language" is
// just whatever the site's EN/ES toggle happened to show, not the language
// the reviewer actually typed in — someone can leave the toggle on English
// and still paste a Spanish review, which silently reversed the translation
// direction and left comment_en/comment_es identical.
const SPANISH_CHARS = /[ñáéíóúü¿¡]/i;
const SPANISH_STOPWORDS = /\b(de|la|el|que|en|los|del|las|una|como|para|con|por|muy|más|fue|son|está|estamos|nuestro|nuestra)\b/gi;
const ENGLISH_STOPWORDS = /\b(the|and|of|to|in|is|for|with|that|this|was|were|are|our|we|you|from)\b/gi;

export function detectLanguage(text: string, fallback: "en" | "es"): "en" | "es" {
  if (SPANISH_CHARS.test(text)) return "es";
  const esScore = (text.match(SPANISH_STOPWORDS) ?? []).length;
  const enScore = (text.match(ENGLISH_STOPWORDS) ?? []).length;
  if (esScore === enScore) return fallback;
  return esScore > enScore ? "es" : "en";
}

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
