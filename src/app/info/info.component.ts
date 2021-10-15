import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameSettings} from "../../models/gameSettings";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {


  @Input() gameSettings: GameSettings | undefined | null;
  @Output() gameSettingsEmitter = new EventEmitter<GameSettings>();

  public updateSettings(score: number | null, lives: number | null, growthRate: number | null, startSpawnChance: number | null, spawnChanceGrowth: number | null, spawnCap: number | null, explosionSize: number | null, poisonCap: number | null): void {
    const tempSettings = new GameSettings(
      this.gameSettings?.winScore,
      this.gameSettings?.startLives,
      this.gameSettings?.growthRate,
      this.gameSettings?.startSpawnChance,
      this.gameSettings?.spawnChanceGrowth,
      this.gameSettings?.spawnCap,
      this.gameSettings?.explosionSize,
      this.gameSettings?.poisonCap
    )

    tempSettings.updateWinScore(score);
    tempSettings.updateLives(lives);
    tempSettings.updateGrowthRate(growthRate);
    tempSettings.updateSpawnChance(startSpawnChance);
    tempSettings.updateSpawnChanceGrowth(spawnChanceGrowth);
    tempSettings.updateSpawnCap(spawnCap);
    tempSettings.updateExplosionSize(explosionSize);
    tempSettings.updatePoisonCap(poisonCap);

    this.gameSettingsEmitter?.emit(tempSettings);
  }

  public getGrowthRate(): number {
    if(this.gameSettings?.growthRate){
      return Math.floor(this.gameSettings.growthRate * 100);
    }else return 0;
  }

  public getSpawnChance(): number {
    if(this.gameSettings?.startSpawnChance){
      return Math.round(this.gameSettings.startSpawnChance * 1000 * 100) / 100;
    }else return 0;
  }

  public getSpawnChanceGrowth(): number {
    if(this.gameSettings?.spawnChanceGrowth){
      return Math.round(this.gameSettings.spawnChanceGrowth * 1000 * 100) / 100;
    }else return 0;
  }





}
