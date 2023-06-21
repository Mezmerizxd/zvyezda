function colorH2A(hex: string): [r: number, g: number, b: number] {
  const [r, g, b] = hex
    .replace('#', '')
    .match(/.{1,2}/g)!
    .map((x) => parseInt(x, 16));
  return [r, g, b];
}

export { colorH2A };
