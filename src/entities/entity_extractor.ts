export class EntityExtractor {
  find<T>(text: string, values: T[], selector: (item: T) => string): T | null {
    return values.find((item) => text.includes(selector(item))) ?? null;
  }
}
