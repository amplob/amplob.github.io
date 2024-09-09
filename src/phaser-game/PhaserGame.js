import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import Enemy from './Enemy';
import Dragon from './Dragon';
import FireButton from './FireButton';
import { Wave } from './Wave';
import { EnemyTypes } from './EnemyTypes';
import { WAVES } from './WavesData';
import { TurnManager } from './TurnManager';
import Village from './Village';
import ResourceManager from './ResourceManager';

const PhaserGame = () => {
  const gameContainerRef = useRef(null);

  const ORIGINAL_SCREEN_WIDTH = 955;
  const ORIGINAL_SCREEN_HEIGHT = 730;

  const currentScreenWidth = window.innerWidth;
  const currentScreenHeight = window.innerHeight;

  const scaleX = currentScreenWidth / ORIGINAL_SCREEN_WIDTH;
  const scaleY = currentScreenHeight / ORIGINAL_SCREEN_HEIGHT;

  const DRAGON_POSITION = { x: 100 * scaleX, y: 600 * scaleY };
  const FIRE_BUTTON_POSITION = { x: 120 * scaleX, y: 680 * scaleY };
  const WAVE_BUTTON_POSITION = { x: 450 * scaleX, y: 450 * scaleY };
  const GOLD_INDICATOR_POSITION = { x: 90 * scaleX, y: 465 * scaleY };

  const init = function () {
    this.enemies = [];
    this.gold = 0;
    this.waveInProgress = false;
    this.currentWaveIndex = 0;
  };

  const preload = function () {
    this.load.image('background', '/phaser-game/assets/background.png');
    this.load.image('dragon', '/phaser-game/assets/dragon.png');
    // Load spritesheets for enemy types
    Object.values(EnemyTypes).forEach(type => {
      this.load.spritesheet(type.imageKey, `/phaser-game/assets/${type.imageKey}Sprite.png`, { 
        frameWidth: 102,  // Width of each frame
        frameHeight: 128  // Height of each frame
      });
    });
    this.load.image('fireButton', '/phaser-game/assets/fire.png');
    this.load.image('fireball', '/phaser-game/assets/fireball.png');
    this.load.image('heart', '/phaser-game/assets/heart.png');
    this.load.image('sword', '/phaser-game/assets/sword.png');
    this.load.image('waveButton', '/phaser-game/assets/waveIcon.png');
    this.load.image('gold', '/phaser-game/assets/gold.png');
  };

  const create = function () {
    this.add.image(400, 400, 'background');

    // Initialize Dragon, ResourceManager, and Village
    this.resourceManager = new ResourceManager(this);
    this.dragon = new Dragon(this, DRAGON_POSITION.x, DRAGON_POSITION.y);
    this.village = new Village(this);
    
    // Initialize TurnManager to control game flow
    this.turnManager = new TurnManager(this);
    this.turnManager.startTurn();

    // Create FireButton instance
    const fireButton = new FireButton(this, FIRE_BUTTON_POSITION, () => {
      this.dragon.fireballAttack();
    });

    // Create and assign Wave instance to the scene
    this.wave = new Wave(this, WAVE_BUTTON_POSITION, WAVES);
    this.wave.updateWaveInfo();

    // Create gold indicator
    this.add.image(GOLD_INDICATOR_POSITION.x, GOLD_INDICATOR_POSITION.y, 'gold').setScale(0.05);
    const goldText = this.add.text(GOLD_INDICATOR_POSITION.x + 20, GOLD_INDICATOR_POSITION.y - 10, '0', { fontSize: '20px', fill: '#fff' });

    this.updateGold = (amount) => {
      this.gold += amount;
      goldText.setText(this.gold);
    };

    // Create animations for each enemy type
    Object.values(EnemyTypes).forEach(type => {
      this.anims.create({
        key: `${type.imageKey}_walk`,
        frames: this.anims.generateFrameNumbers(type.imageKey, { start: 0, end: 7 }), // Total of 8 frames
        frameRate: 10,
        repeat: -1
      });
    });

    this.handleEnemyDeath = function(enemy) {
      this.enemies = this.enemies.filter(e => e !== enemy);
      this.updateGold(10);
      this.enemiesRemaining--;
      if (this.enemiesRemaining <= 0 && this.enemiesToSpawn <= 0) {
        this.waveInProgress = false;
        this.wave.button.setVisible(true);
      }
    };
  };

  const update = function () {
    const { enemies, dragon } = this;
  
    if (!dragon) {
      console.error('Dragon is not initialized');
      return;
    }

    if (Array.isArray(enemies) && enemies.length > 0) {
      enemies.forEach(enemy => {
        if (enemy && enemy.sprite) {
          enemy.moveTowards(dragon.sprite.x);
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
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { y: 0 },
        },
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
