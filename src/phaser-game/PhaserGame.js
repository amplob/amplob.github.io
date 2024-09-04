import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import Soldier from './Soldier';
import { SoldierTypes } from './SoldierTypes';
import Dragon from './Dragon';
import FireButton from './FireButton';  // Import the FireButton class

const PhaserGame = () => {
  const gameContainerRef = useRef(null);

  const DRAGON_POSITION = { x: 100, y: 600 };
  const SOLDIER_SPAWN_Y = 600;
  const FIRE_BUTTON_POSITION = { x: 150, y: 650 };
  const MAX_SOLDIERS = 5;

  const init = function () {
    this.soldiers = [];
  };

  const preload = function () {
    this.load.image('background', '/phaser-game/assets/background.png');
    this.load.image('dragon', '/phaser-game/assets/dragon.png');
    this.load.image('soldier', '/phaser-game/assets/soldier.png');
    this.load.image('fireButton', '/phaser-game/assets/fire.png');
  };

  const create = function () {
    this.add.image(400, 400, 'background');

    // Create Dragon instance
    const dragon = new Dragon(this, DRAGON_POSITION.x, DRAGON_POSITION.y);

    // Create FireButton instance
    const fireButton = new FireButton(this, FIRE_BUTTON_POSITION, () => {
      dragon.fireballAttackOnSoldiers(this.soldiers);  // Trigger fireball attack
    });

    // Spawn soldiers at intervals
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.soldiers.length < MAX_SOLDIERS) {
          new Soldier(this, 800, SOLDIER_SPAWN_Y, SoldierTypes.type1); // Spawn type1 soldiers
        }
      },
      loop: true,
    });

    this.dragon = dragon;
  };

  const update = function () {
    const { soldiers, dragon } = this;

    soldiers.forEach(soldier => {
      soldier.moveTowards(dragon.x);

      if (soldier.sprite.x <= dragon.x + 50) {
        dragon.attackSoldier(soldier);

        if (soldier.hp > 0) {
          soldier.bounceBack();
        }
      }
    });

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
