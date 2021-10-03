export function toCanvasCoordinate(c: number, resolution: number): number {
  return (c - (resolution/2)) / (resolution/2);
}

export function toScreenCoordinate(c: number, resolution: number): number {
  return (c * (resolution/2)) + (resolution/2)
}
