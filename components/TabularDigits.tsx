export function TabularDigits({ value }: { value: string }) {
  return Array.from(value, (character, index) =>
    /[0-9]/.test(character)
      ? <span className="type-digit" key={index}>{character}</span>
      : character,
  );
}
