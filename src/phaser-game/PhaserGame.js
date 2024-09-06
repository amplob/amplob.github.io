import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import Enemy from './Enemy';
import Dragon from './Dragon';
import FireButton from './FireButton';
import { Wave } from './Wave';
import { EnemyTypes } from './EnemyTypes';
import { WAVES } from './WavesData';

const PhaserGame = () => {
  const gameContainerRef = useRef(null);

  const DRAGON_POSITION = { x: 100, y: 600 };
  const FIRE_BUTTON_POSITION = { x: 120, y: 680 };
  const WAVE_BUTTON_POSITION = { x: 750, y: 650 };
  const GOLD_INDICATOR_POSITION = { x: 90, y: 465 };

  const init = function () {
    this.enemies = [];
    this.gold = 0;
    this.waveInProgress = false;
    this.currentWaveIndex = 0;
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
  
    // Create Wave instance
    const wave = new Wave(this, WAVE_BUTTON_POSITION, WAVES);
    wave.updateWaveInfo();
  
    // Create gold indicator
    this.add.image(GOLD_INDICATOR_POSITION.x, GOLD_INDICATOR_POSITION.y, 'gold').setScale(0.05);
    const goldText = this.add.text(GOLD_INDICATOR_POSITION.x + 20, GOLD_INDICATOR_POSITION.y - 10, '0', { fontSize: '20px', fill: '#fff' });
  
    this.updateGold = (amount) => {
      this.gold += amount;
      goldText.setText(this.gold);
    };
  
    // Assign dragon, wave, and gold UI elements to the scene object
    this.dragon = dragon;
    this.goldText = goldText;
    this.wave = wave;
  
    // Bind the handleEnemyDeath function to this scene
    this.handleEnemyDeath = function(enemy) {
      // Remove the enemy from the enemies array
      this.enemies = this.enemies.filter(e => e !== enemy);
      
      // Award gold for killing an enemy
      this.updateGold(10);
    
      // Decrement the remaining enemy count
      this.enemiesRemaining--;
    
      // If no enemies are left and no more need to spawn, show the wave button
      if (this.enemiesRemaining <= 0 && this.enemiesToSpawn <= 0) {
        this.waveInProgress = false;
        this.wave.button.setVisible(true); // Make sure the button reappears
      }
    };
  };
  
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
