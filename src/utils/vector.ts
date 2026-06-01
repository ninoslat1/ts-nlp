export function cosine(a: number[], b: number[]) {
  let dot = 0,
    magA = 0,
    magB = 0;

  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;

    dot += av * bv;
    magA += av * av;
    magB += bv * bv;
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);

  return denom === 0 ? 0 : dot / denom;
}
