import Phaser from 'phaser';

export default class Enemy {
  constructor(scene, x, y, type) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.type = type;

    this.hp = type.hp;
    this.attack = type.attack;
    this.bounceBackValue = type.bounceBack;
    this.loot= type.loot;

    // Create enemy sprite and add physics
    this.sprite = scene.physics.add.sprite(x, y, type.imageKey).setScale(0.5);
    this.sprite.play(`${type.imageKey}_walk`); // Play the walking animation

    // Create health bar
    this.healthBar = scene.add.graphics();
    this.updateHealthBar();
    
    if (!scene.enemies) {
      scene.enemies = [];
    }
    scene.enemies.push(this);
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(this.sprite.x - 25, this.sprite.y - 40, (this.hp / this.type.maxHp) * 50, 5);
  }

  takeDamage(damage) {
    this.hp -= damage;
    this.updateHealthBar();
    if (this.hp <= 0) {
      this.healthBar.destroy();
      this.sprite.destroy();
      this.scene.handleEnemyDeath(this);
      return true;
    }
    return false;
  }

  moveTowards(targetX) {
    if (this.sprite && this.sprite.x > targetX + 50) {
      this.sprite.x -= 1;
      this.updateHealthBar();
    }
  }

  bounceBack() {
    if (this.sprite) {
      this.sprite.x -= this.bounceBackValue;
      this.updateHealthBar();
    }
  }
}
