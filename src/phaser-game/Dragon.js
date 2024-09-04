import Phaser from 'phaser';

export default class Dragon {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.sprite = scene.add.sprite(x, y, 'dragon').setScale(0.1);
    this.hp = 100;
    this.attack = 20;
    this.fireballAttack = 8;

    this.healthBar = scene.add.graphics();
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(x - 50, y + 50, 100, 10);

    this.statsText = scene.add.text(10, 10, `HP: ${this.hp} | Attack: ${this.attack}`, { fontSize: '20px', fill: '#fff' });
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(this.x - 50, this.y + 50, (this.hp / 100) * 100, 10);
  }

  takeDamage(damage) {
    this.hp -= damage;
    this.updateHealthBar();
    this.statsText.setText(`HP: ${this.hp} | Attack: ${this.attack}`);
  }

  attackSoldier(soldier) {
    if (soldier.takeDamage(this.attack)) {
      this.scene.soldiers = this.scene.soldiers.filter(s => s !== soldier);
    }
  }

  fireballAttackOnSoldiers(soldiers) {
    soldiers.forEach(soldier => {
      if (soldier.takeDamage(this.fireballAttack)) {
        this.scene.soldiers = this.scene.soldiers.filter(s => s !== soldier);
      }
    });
  }
}
