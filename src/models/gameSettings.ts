export class GameSettings {

  winScore: number;
  startLives: number;
  growthRate: number;
  startSpawnChance: number;
  spawnChanceGrowth: number;
  spawnCap: number;

  constructor(winScore = 25, startLives= 2, growthRate = 0.3, startSpawnChance = 0.004, spawnChanceGrowth = 0.001, spawnCap = 5) {
    this.winScore = winScore;
    this.startLives = startLives;
    this.growthRate = growthRate;
    this.startSpawnChance = startSpawnChance;
    this.spawnChanceGrowth = spawnChanceGrowth;
    this.spawnCap = spawnCap;
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

}
