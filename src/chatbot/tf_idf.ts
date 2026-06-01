export class TfIdf {
  private vocab = new Map<string, number>();
  private idf = new Map<string, number>();

  fit(docs: string[]) {
    const count = docs.length;
    const df = new Map<string, number>();

    for (const doc of docs) {
      const seen = new Set<string>();

      for (const word of doc.split(" ")) {
        if (!seen.has(word)) {
          df.set(word, (df.get(word) ?? 0) + 1);
          seen.add(word);
        }
      }
    }

    let index = 0;
    for (const [word] of df) {
      this.vocab.set(word, index++);

      const idfValue = Math.log(count / (df.get(word)! + 1));
      this.idf.set(word, idfValue);
    }
  }

  transform(text: string): number[] {
    const vec = Array.from({ length: this.vocab.size }, () => 0);
    const words = text.split(" ");

    for (const word of words) {
      const index = this.vocab.get(word);
      if (index === undefined) continue;

      const idf = this.idf.get(word) ?? 0;
      if (vec[index] === undefined) vec[index] = 0;
      vec[index] += idf;
    }

    return vec;
  }
}
