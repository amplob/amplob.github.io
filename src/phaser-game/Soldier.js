// src/phaser-game/Soldier.js

import Phaser from 'phaser';

export default class Soldier {
  constructor(scene, x, y, type) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.type = type;

    // Define soldier properties based on type
    this.hp = type.hp;
    this.attack = type.attack;
    this.bounceBackValue = type.bounceBack;

    // Create soldier sprite
    this.sprite = scene.add.sprite(x, y, type.imageKey).setScale(0.05);

    // Create health bar
    this.healthBar = scene.add.graphics();
    this.updateHealthBar();
    
    // Track soldier in the scene
    scene.soldiers.push(this);
  }

  // Update the soldier's health bar
  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(this.sprite.x - 25, this.sprite.y - 40, (this.hp / this.type.maxHp) * 50, 5);
  }

  // Handle damage
  takeDamage(damage) {
    this.hp -= damage;
    this.updateHealthBar();

    if (this.hp <= 0) {
      this.healthBar.destroy();
      this.sprite.destroy();
      return true; // Soldier is dead
    }

    return false; // Soldier is still alive
  }

  // Move soldier towards the dragon
  moveTowards(targetX) {
    if (this.sprite.x > targetX + 50) {
      this.sprite.x -= 1;
      this.updateHealthBar();
    }
  }

  // Bounce soldier back
  bounceBack() {
    this.sprite.x -= this.bounceBackValue;
    this.updateHealthBar();
  }
}
