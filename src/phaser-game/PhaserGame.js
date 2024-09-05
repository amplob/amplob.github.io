import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import Enemy from './Enemy'; // Change Soldier to Enemy
import { EnemyTypes } from './EnemyTypes'; // SoldierTypes could still remain the same
import Dragon from './Dragon';
import FireButton from './FireButton';
import {WaveButton} from './WaveButton';

const PhaserGame = () => {
  const gameContainerRef = useRef(null);

  const DRAGON_POSITION = { x: 100, y: 600 };
  const ENEMY_SPAWN_Y = 600; // Rename SOLDIER_SPAWN_Y to ENEMY_SPAWN_Y
  const FIRE_BUTTON_POSITION = { x: 120, y: 680 };
  const WAVE_BUTTON_POSITION = { x: 750, y: 650 };
  const GOLD_INDICATOR_POSITION = { x: 90, y: 465 };
  const WAVES = [
    [
      { type: EnemyTypes.type1, count: 2 },
    ],
    [
      { type: EnemyTypes.type1, count: 5 },
    ],
    [
      { type: EnemyTypes.type1, count: 8 },
    ],
    // Add more waves as needed
  ];

  let currentWaveIndex = 0;

  const init = function () {
    this.enemies = []; // Change soldiers to enemies
    this.gold = 0;
    this.waveInProgress = false;
  };

  const preload = function () {
    this.load.image('background', '/phaser-game/assets/background.png');
    this.load.image('dragon', '/phaser-game/assets/dragon.png');
    this.load.image('enemy', '/phaser-game/assets/soldier.png'); // Keep enemy sprite
    // Load the images for each enemy type based on the imageKey
  Object.values(EnemyTypes).forEach(type => {
    this.load.image(type.imageKey, `/phaser-game/assets/${type.imageKey}.png`);
  });
    this.load.image('fireButton', '/phaser-game/assets/fire.png');
    this.load.image('heart', '/phaser-game/assets/heart.png');
    this.load.image('sword', '/phaser-game/assets/sword.png');
    this.load.image('waveButton', '/phaser-game/assets/waveIcon.png');
    this.load.image('gold', '/phaser-game/assets/gold.png'); // Load gold.png for the gold indicator
  };

  const create = function () {
    this.add.image(400, 400, 'background');

    // Create Dragon instance
    const dragon = new Dragon(this, DRAGON_POSITION.x, DRAGON_POSITION.y);

    // Create FireButton instance
    const fireButton = new FireButton(this, FIRE_BUTTON_POSITION, () => {
      dragon.fireballAttackOnEnemies(this.enemies); // Change soldiers to enemies
    });

    // Create WaveButton instance
    const waveButton = new WaveButton(this, WAVE_BUTTON_POSITION, () => {
      startNextWave.call(this);
    });

    waveButton.updateWaveInfo(WAVES[currentWaveIndex]);

    // Create gold indicator
    const goldIcon = this.add.image(GOLD_INDICATOR_POSITION.x, GOLD_INDICATOR_POSITION.y, 'gold').setScale(0.05);
    const goldText = this.add.text(GOLD_INDICATOR_POSITION.x + 20, GOLD_INDICATOR_POSITION.y - 10, '0', { fontSize: '20px', fill: '#fff' });

    this.updateGold = (amount) => {
      this.gold += amount;
      goldText.setText(this.gold);
    };

    this.dragon = dragon;
    this.goldText = goldText;
    this.waveButton = waveButton;
    this.handleEnemyDeath = handleEnemyDeath.bind(this); // Change to handleEnemyDeath

  };

  const startNextWave = function () {
    if (this.waveInProgress) return;
  
    this.waveInProgress = true;
    const wave = WAVES[currentWaveIndex].map(enemyData => ({ ...enemyData })); // Create a deep copy of the wave data
  
    let totalEnemiesInWave = 0;
    wave.forEach(enemyData => {
      totalEnemiesInWave += enemyData.count;
    });
  
    this.enemiesRemaining = totalEnemiesInWave;
    this.enemiesToSpawn = totalEnemiesInWave; // Track how many enemies need to spawn
  
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        // Ensure wave has enemies left to spawn
        if (this.enemiesToSpawn > 0 && wave.length > 0) {
          const enemyData = wave[0];  // Get the current enemy type
          if (enemyData && enemyData.count > 0) {
            const enemy = new Enemy(this, 800, ENEMY_SPAWN_Y, enemyData.type);
            this.enemies.push(enemy); // Add the enemy to the enemies array
            enemyData.count--; // Decrement the count of remaining enemies to spawn
            this.enemiesToSpawn--; // Decrement the total enemies to spawn
          }
  
          // Once this enemy type's count reaches 0, shift to the next type
          if (enemyData && enemyData.count <= 0) {
            wave.shift(); // Move to the next type of enemy if needed
          }
        }
  
        // Check if all enemies in the wave are defeated
        if (this.enemiesRemaining <= 0 && this.enemiesToSpawn <= 0) {
          this.waveInProgress = false;
          currentWaveIndex = (currentWaveIndex + 1) % WAVES.length;
          this.waveButton.setVisible(true);
          this.waveButton.updateWaveInfo(WAVES[currentWaveIndex]);
        }
      },
      loop: true,
    });
  
    this.waveButton.setVisible(false);
  };
  
  
  
  
  function handleEnemyDeath(enemy) {
    // Remove the enemy from the enemies array
    this.enemies = this.enemies.filter(e => e !== enemy);
    this.updateGold(10); // Award gold for killing an enemy
  
    // Decrement the remaining enemy count
    this.enemiesRemaining--;
  
    // If no enemies are left and no more need to spawn, show the wave button
    if (this.enemiesRemaining <= 0 && this.enemiesToSpawn <= 0) {
      this.waveButton.setVisible(true);
      this.waveButton.updateWaveInfo(WAVES[currentWaveIndex]);
    }
  }
  
  

  const update = function () {
    const { enemies, dragon } = this;
  
    // Check if dragon exists
    if (!dragon) {
      console.error('Dragon is not initialized');
      return;
    }
  
    // Check if enemies array is defined and not empty
    if (Array.isArray(enemies) && enemies.length > 0) {
      enemies.forEach(enemy => {
        if (enemy && enemy.sprite) {
          enemy.moveTowards(dragon.x);
  
          if (enemy.sprite.x <= dragon.x + 50) {
            dragon.attackEnemy(enemy); // Change attackSoldier to attackEnemy
            dragon.takeDamage(enemy.type.attack);
            if (enemy.hp > 0) {
              enemy.bounceBack();
            }
          }
        }
      });
    }
    
    // Check if dragon has hp property
    if (dragon.hp <= 0) {
      this.add.text(300, 400, 'Game Over', { fontSize: '50px', fill: '#ff0000' });
      this.scene.pause();
    }
  };

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 800,
      parent: gameContainerRef.current,
      scene: {
        init,
        preload,
        create,
        update,
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div>
      <div ref={gameContainerRef}></div>
    </div>
  );
};

export default PhaserGame;
