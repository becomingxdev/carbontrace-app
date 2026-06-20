/**
 * Robust extraction of JSON payloads from Gemini model responses.
 * Handles markdown fences, surrounding prose, and partial payloads.
 */
export function parseAIResponse(raw: string): unknown {
  if (!raw || !raw.trim()) {
    throw new Error('Empty AI response');
  }

  const trimmed = raw.trim();

  const fencedCandidates = extractFencedJson(trimmed);
  for (const candidate of fencedCandidates) {
    const parsed = tryParseJson(candidate);
    if (parsed !== undefined) return parsed;
  }

  const objectCandidate = extractJsonObject(trimmed);
  if (objectCandidate) {
    const parsed = tryParseJson(objectCandidate);
    if (parsed !== undefined) return parsed;
  }

  const directParsed = tryParseJson(trimmed);
  if (directParsed !== undefined) return directParsed;

  throw new Error('Malformed AI response: unable to parse JSON payload');
}

function extractFencedJson(text: string): string[] {
  const candidates: string[] = [];
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)```/gi;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(text)) !== null) {
    candidates.push(match[1].trim());
  }

  return candidates;
}

function extractJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return text.slice(start, end + 1);
}

function tryParseJson(value: string): unknown | undefined {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}
