export function findEntity(
  text: string,
  values: string[]
) {
  const normalized = text.toLowerCase();

  return (
    values.find(v =>
      normalized.includes(v.toLowerCase())
    ) ?? null
  );
}