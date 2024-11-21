import ResourceManager from './ResourceManager';
import Dragon from './Dragon';
import Village from './Village';
import FireButton from './FireButton';
import Wave from './Wave';
import { EnemyTypes } from './EnemyTypes';

export default class GameManager {
  constructor(scene, DRAGON_POSITION, FIRE_BUTTON_POSITION, WAVE_BUTTON_POSITION, GOLD_INDICATOR_POSITION, WAVES) {
    this.scene = scene;
    this.enemies = [];
    this.gold = 0;
    this.waveInProgress = false;
    this.currentWaveIndex = 0;

    this.initGameElements(DRAGON_POSITION, FIRE_BUTTON_POSITION, WAVE_BUTTON_POSITION, GOLD_INDICATOR_POSITION, WAVES);
  }

  initGameElements(DRAGON_POSITION, FIRE_BUTTON_POSITION, WAVE_BUTTON_POSITION, GOLD_INDICATOR_POSITION, WAVES) {
    this.scene.resourceManager = new ResourceManager(this.scene);  // ResourceManager is now available
    this.scene.dragon = new Dragon(this.scene, DRAGON_POSITION.x, DRAGON_POSITION.y);
    this.scene.village = new Village(this.scene);

    // Create FireButton instance
    this.fireButton = new FireButton(this.scene, FIRE_BUTTON_POSITION, () => {
      this.scene.dragon.fireballAttack();
    });

    // Create and assign Wave instance
    this.scene.wave = new Wave(this.scene, WAVE_BUTTON_POSITION, WAVES);
    this.scene.wave.updateWaveInfo();

    // Create gold indicator
    this.goldIndicator = this.scene.add.image(GOLD_INDICATOR_POSITION.x, GOLD_INDICATOR_POSITION.y, 'gold').setScale(0.05);
    this.goldText = this.scene.add.text(GOLD_INDICATOR_POSITION.x + 20, GOLD_INDICATOR_POSITION.y - 10, '0', { fontSize: '20px', fill: '#fff' });

    // Create animations for each enemy type
    Object.values(EnemyTypes).forEach(type => {
      this.scene.anims.create({
        key: `${type.imageKey}_walk`,
        frames: this.scene.anims.generateFrameNumbers(type.imageKey, { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1,
      });
    });
  }

  handleEnemyDeath(enemy) {
    this.enemies = this.enemies.filter(e => e !== enemy);
    this.updateGold(10);
    this.enemiesRemaining--;
    if (this.enemiesRemaining <= 0 && this.enemiesToSpawn <= 0) {
      this.waveInProgress = false;
      this.scene.wave.button.setVisible(true);
    }
  }

  updateGold(amount) {
    this.gold += amount;
    this.goldText.setText(this.gold);
  }

  update() {
    const { dragon } = this.scene;

    if (Array.isArray(this.enemies) && this.enemies.length > 0) {
      this.enemies.forEach(enemy => {
        if (enemy && enemy.sprite) {
          enemy.moveTowards(dragon.sprite.x);  // Ensure the enemy moves towards the dragon
          if (enemy.sprite.x <= dragon.sprite.x + 50) {
            dragon.attackEnemy(enemy);
            dragon.takeDamage(enemy.type.attack);
            if (enemy.hp > 0) {
              enemy.bounceBack();
            }
          }
        }
      });
    }

    if (dragon.hp <= 0) {
      this.scene.add.text(300, 400, 'Game Over', { fontSize: '50px', fill: '#ff0000' });
      this.scene.scene.pause();
    }
  }
}
