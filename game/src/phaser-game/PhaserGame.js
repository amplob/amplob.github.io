import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameManager from './GameManager';
import ScreenSetup from './ScreenSetup';
import { EnemyTypes } from './EnemyTypes';
import { WAVES } from './WavesData';
import { TurnManager } from './TurnManager';


const ORIGINAL_SCREEN_WIDTH = 900;
const ORIGINAL_SCREEN_HEIGHT = 600;

const preload = function () {
  this.load.image('background', '/phaser-game/assets/background.png');
  this.load.image('dragon', '/phaser-game/assets/dragon.png');
  Object.values(EnemyTypes).forEach(type => {
    this.load.spritesheet(type.imageKey, `/phaser-game/assets/${type.imageKey}Sprite.png`, { 
      frameWidth: 102,
      frameHeight: 128
    });
  });
  this.load.image('fireButton', '/phaser-game/assets/fire.png');
  this.load.image('fireball', '/phaser-game/assets/fireball.png');
  this.load.image('waveButton', '/phaser-game/assets/waveIcon.png');
  this.load.image('gold', '/phaser-game/assets/gold.png');
};

const create = function () {
  const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
  background.setDisplaySize(this.scale.width, this.scale.height);

  this.screenSetup = new ScreenSetup(this.scale.width, this.scale.height);

  // Now positions are correctly set once
  const dragonPosition = this.screenSetup.getDragonPosition();
  const fireButtonPosition = this.screenSetup.getFireButtonPosition();
  const waveButtonPosition = this.screenSetup.getWaveButtonPosition();
  const goldIndicatorPosition = this.screenSetup.getGoldIndicatorPosition();

  this.gameManager = new GameManager(
    this,
    dragonPosition,
    fireButtonPosition,
    waveButtonPosition,
    goldIndicatorPosition,
    WAVES
  );

  this.turnManager = new TurnManager(this);
  this.turnManager.startTurn();
};


const update = function () {
  this.gameManager.update()
};

const PhaserGame = () => {
  const gameContainerRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: ORIGINAL_SCREEN_WIDTH,
      height: ORIGINAL_SCREEN_HEIGHT,
      parent: gameContainerRef.current,
      scene: {
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
      scale: {
        mode: Phaser.Scale.NONE,  // Disable automatic scaling
        width: ORIGINAL_SCREEN_WIDTH,  // Fixed width
        height: ORIGINAL_SCREEN_HEIGHT,  // Fixed height  
        //autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, [ORIGINAL_SCREEN_WIDTH, ORIGINAL_SCREEN_HEIGHT]);

  return <div ref={gameContainerRef}></div>;
};

export default PhaserGame;
