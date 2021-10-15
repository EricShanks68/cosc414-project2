export class GameSettings {

  winScore: number;
  startLives: number;
  growthRate: number;
  startSpawnChance: number;
  spawnChanceGrowth: number;
  spawnCap: number;
  explosionSize: number;
  poisonCap: number;

  constructor(winScore = 25, startLives= 2, growthRate = 0.15, startSpawnChance = 0.0025, spawnChanceGrowth = 0.001, spawnCap = 5, explosionSize = 25, poisonCap = 2) {
    this.winScore = winScore;
    this.startLives = startLives;
    this.growthRate = growthRate;
    this.startSpawnChance = startSpawnChance;
    this.spawnChanceGrowth = spawnChanceGrowth;
    this.spawnCap = spawnCap;
    this.explosionSize = explosionSize;
    this.poisonCap = poisonCap;
  }

  public updateWinScore(score: number | undefined | null): void {
    if(!score) return;
    this.winScore = score;
  }

  public updateLives(lives: number | undefined | null): void {
    if(!lives) return;
    this.startLives = lives;
  }

  public updateGrowthRate(growth: number | undefined | null): void {
    if(!growth) return;
    this.growthRate = growth;
  }

  public updateSpawnChance(chance: number | undefined | null): void {
    if(!chance) return
    this.startSpawnChance = chance;
  }

  public updateSpawnChanceGrowth(chanceGrowth: number | undefined | null): void {
    if(!chanceGrowth) return;
    this.spawnChanceGrowth = chanceGrowth;
  }

  public updateSpawnCap(cap: number | undefined | null): void {
    if(!cap) return;
    this.spawnCap = cap;
  }

  public updateExplosionSize(size: number | undefined | null) {
    if(!size) return;
    this.explosionSize = size;
  }

  public updatePoisonCap(cap: number | undefined | null){
    if(!cap) return;
    this.poisonCap = cap;
  }

}
