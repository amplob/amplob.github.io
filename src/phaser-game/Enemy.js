import Phaser from 'phaser';

export default class Enemy {
  constructor(scene, x, y, type) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.type = type;

    // Define enemy properties based on type
    this.hp = type.hp;
    this.attack = type.attack;
    this.bounceBackValue = type.bounceBack;
    this.loot= type.loot;

    // Create enemy sprite using the imageKey from the enemy type
    this.sprite = scene.add.sprite(x, y, type.imageKey).setScale(0.05);

    // Create health bar
    this.healthBar = scene.add.graphics();
    this.updateHealthBar();
    
    // Track enemy in the scene
    if (!scene.enemies) {
      scene.enemies = []; // Initialize enemies array if not already present
    }
    scene.enemies.push(this);
  }

  // Update the enemy's health bar
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
      this.scene.handleEnemyDeath(this); // Call the scene's handleEnemyDeath method
      return true; // Enemy is dead
    }

    return false; // Enemy is still alive
  }


  // Move enemy towards the dragon
  moveTowards(targetX) {
    if (this.sprite && this.sprite.x > targetX + 50) {
      this.sprite.x -= 1; // Adjust movement speed as needed
      this.updateHealthBar();
    }
  }

  // Bounce enemy back
  bounceBack() {
    if (this.sprite) {
      this.sprite.x -= this.bounceBackValue;
      this.updateHealthBar();
    }
  }
}
