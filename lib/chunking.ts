export type Chunk = {
  content: string;
  start: number;
  end: number;
  order: number;
};

const MAX_CHARS = 900;
const MIN_CHARS = 400;

export const chunkText = (text: string): Chunk[] => {
  const paragraphs = text.split(/\n\s*\n/).map((para) => para.trim()).filter(Boolean);
  const chunks: Chunk[] = [];
  let buffer = "";
  let start = 0;
  let order = 0;
  let cursor = 0;

  for (const para of paragraphs) {
    if ((buffer + "\n\n" + para).length > MAX_CHARS && buffer.length >= MIN_CHARS) {
      chunks.push({ content: buffer.trim(), start, end: cursor, order });
      order += 1;
      buffer = "";
      start = cursor;
    }
    if (buffer.length) {
      buffer += "\n\n";
    }
    buffer += para;
    cursor += para.length + 2;
  }

  if (buffer.trim().length) {
    chunks.push({ content: buffer.trim(), start, end: cursor, order });
  }

  return chunks;
};
