import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import Soldier from './Soldier';
import { SoldierTypes } from './SoldierTypes';

const PhaserGame = () => {
  const gameContainerRef = useRef(null);

  const DRAGON_POSITION = { x: 100, y: 600 };
  const SOLDIER_SPAWN_Y = 600;
  const FIRE_BUTTON_POSITION = { x: 150, y: 650 };
  const MAX_SOLDIERS = 10;

  const init = function () {
    this.soldiers = [];
    this.fireCooldown = false;
    this.fireCooldownProgress = 0;
  };

  const preload = function () {
    this.load.image('background', '/phaser-game/assets/background.png');
    this.load.image('dragon', '/phaser-game/assets/dragon.png');
    this.load.image('soldier', '/phaser-game/assets/soldier.png');
    this.load.image('fireButton', '/phaser-game/assets/fire.png');
  };

  const create = function () {
    this.add.image(400, 400, 'background');

    const dragon = this.add.sprite(DRAGON_POSITION.x, DRAGON_POSITION.y, 'dragon').setScale(0.1);
    dragon.hp = 100;
    dragon.attack = 20;
    dragon.fireballAttack = 8;

    const dragonStatsText = this.add.text(10, 10, `HP: ${dragon.hp} | Attack: ${dragon.attack}`, { fontSize: '20px', fill: '#fff' });

    const dragonHealthBar = this.add.graphics();
    dragonHealthBar.fillStyle(0x00ff00, 1);
    dragonHealthBar.fillRect(DRAGON_POSITION.x - 50, DRAGON_POSITION.y + 50, 100, 10);

    const updateDragonHealthBar = () => {
      dragonHealthBar.clear();
      dragonHealthBar.fillStyle(0x00ff00, 1);
      dragonHealthBar.fillRect(DRAGON_POSITION.x - 50, DRAGON_POSITION.y + 50, (dragon.hp / 100) * 100, 10);
    };

    const fireButton = this.add.sprite(FIRE_BUTTON_POSITION.x, FIRE_BUTTON_POSITION.y, 'fireButton').setScale(0.1).setInteractive();
    const cooldownGraphics = this.add.graphics();

    fireButton.on('pointerdown', () => {
      if (!this.fireCooldown) {
        triggerFireballAttack();
      }
    });

    const triggerFireballAttack = () => {
      this.soldiers.forEach(soldier => {
        if (soldier.takeDamage(dragon.fireballAttack)) {
          this.soldiers = this.soldiers.filter(s => s !== soldier);
        }
      });

      this.fireCooldown = true;
      this.fireCooldownProgress = 0;
      fireButton.setTint(0x888888);

      this.time.addEvent({
        delay: 80, // Update every 80ms
        callback: () => {
          this.fireCooldownProgress += 1;
          drawCooldownArc();
          if (this.fireCooldownProgress >= 100) {
            this.fireCooldown = false;
            fireButton.clearTint();
            cooldownGraphics.clear();
          }
        },
        repeat: 99, // Repeat 99 times to complete the 8000ms cooldown
      });

      const fire = this.add.image(dragon.x + 50, dragon.y, 'fireButton').setScale(0.1);
      this.time.delayedCall(500, () => fire.destroy());
    };

    const drawCooldownArc = () => {
      const radius = 30;
      cooldownGraphics.clear();
      cooldownGraphics.lineStyle(3, 0x888888, 1);
      cooldownGraphics.beginPath();
      cooldownGraphics.arc(FIRE_BUTTON_POSITION.x, FIRE_BUTTON_POSITION.y, radius, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad((360 * this.fireCooldownProgress / 100) - 90), false);
      cooldownGraphics.strokePath();
    };

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
    this.dragonStatsText = dragonStatsText;
    this.updateDragonHealthBar = updateDragonHealthBar;
  };

  const update = function () {
    const { soldiers, dragon, updateDragonHealthBar } = this;

    soldiers.forEach(soldier => {
      soldier.moveTowards(dragon.x);

      if (soldier.sprite.x <= dragon.x + 50) {
        if (soldier.takeDamage(dragon.attack)) {
          this.soldiers = this.soldiers.filter(s => s !== soldier);
        }

        dragon.hp -= soldier.attack;
        updateDragonHealthBar();

        if (soldier.hp > 0) {
          soldier.bounceBack();
        }

        this.dragonStatsText.setText(`HP: ${dragon.hp} | Attack: ${dragon.attack}`);
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
