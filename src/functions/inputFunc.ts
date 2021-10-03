import {Vector2} from "../models/vector2";

export function getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent): Vector2 {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = rect.bottom - event.clientY ;

  return new Vector2(x, y);
}
