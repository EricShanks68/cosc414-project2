export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static White = new Color(1, 1, 1, 1);
  static Black = new Color(0, 0,0,1);
  static Green = new Color(0,1,0,1);

}
