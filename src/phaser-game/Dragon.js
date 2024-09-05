import Phaser from 'phaser';

export default class Dragon {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    // Add Dragon sprite
    this.sprite = scene.add.sprite(x, y, 'dragon').setScale(0.1);
    this.hp = 100;
    this.attack = 20;
    this.fireballAttack = 8;

    // Health UI
    this.heartIcon = scene.add.image(x - 10, y - 100, 'heart').setScale(0.05);
    this.healthText = scene.add.text(x + 10, y - 108, `${this.hp}`, { fontSize: '20px', fill: '#fff' });

    // Attack UI
    this.swordIcon = scene.add.image(x - 10, y - 70, 'sword').setScale(0.05);
    this.attackText = scene.add.text(x + 10, y - 78, `${this.attack}`, { fontSize: '20px', fill: '#fff' });

    // Health Bar
    this.healthBar = scene.add.graphics();
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(x - 50, y + 50, 100, 10);
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(this.x - 50, this.y + 50, (this.hp / 100) * 100, 10);
    this.healthText.setText(`${this.hp}`);
  }

  takeDamage(damage) {
    this.hp -= damage;
    this.updateHealthBar();
    this.attackText.setText(`${this.attack}`);
  }

  // Update the method to handle enemy instead of soldier
  attackEnemy(enemy) {
    if (enemy.takeDamage(this.attack)) {
      this.scene.enemies = this.scene.enemies.filter(e => e !== enemy); // Update to enemies
    }
  }

  // Update the fireball attack to target enemies instead of soldiers
  fireballAttackOnEnemies(enemies) {
    enemies.forEach(enemy => {
      if (enemy.takeDamage(this.fireballAttack)) {
        this.scene.enemies = this.scene.enemies.filter(e => e !== enemy); // Update to enemies
      }
    });
  }
}
