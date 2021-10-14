export interface Entity {

  alive: boolean;
  type: EntityType;

  update(): void;
  die(): void;

}

export enum EntityType {
  Bacteria,
  ExplosionParticle
}
