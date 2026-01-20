const EMBEDDING_SIZE = 64;

export type EmbeddingVector = number[];

export const embedText = (text: string): EmbeddingVector => {
  const vector = new Array<number>(EMBEDDING_SIZE).fill(0);
  let index = 0;
  for (const char of text) {
    const code = char.charCodeAt(0);
    vector[index % EMBEDDING_SIZE] += (code % 97) + 1;
    index += 1;
  }
  return normalize(vector);
};

export const cosineSimilarity = (a: EmbeddingVector, b: EmbeddingVector): number => {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const normalize = (vector: number[]): number[] => {
  let norm = 0;
  for (const value of vector) {
    norm += value * value;
  }
  const scale = norm ? 1 / Math.sqrt(norm) : 1;
  return vector.map((value) => value * scale);
};
