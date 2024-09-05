import Phaser from 'phaser';

export default class FireButton {
  constructor(scene, position, onFireCallback) {
    this.scene = scene;
    this.position = position;
    this.onFireCallback = onFireCallback;
    this.cooldownGraphics = scene.add.graphics();
    this.fireCooldown = false;
    this.fireCooldownProgress = 0;

    this.button = scene.add.sprite(position.x, position.y, 'fireButton').setScale(0.16).setInteractive();
    this.button.on('pointerdown', () => {
      if (!this.fireCooldown) {
        this.onFireCallback();  // Execute the fire action
        this.startCooldown();
      }
    });
  }

  startCooldown() {
    this.fireCooldown = true;
    this.fireCooldownProgress = 0;
    this.button.setTint(0x888888);

    this.scene.time.addEvent({
      delay: 60,  // Update every 60ms*100= 6s
      callback: () => {
        this.fireCooldownProgress += 1;
        this.drawCooldownArc();
        if (this.fireCooldownProgress >= 100) {
          this.fireCooldown = false;
          this.button.clearTint();
          this.cooldownGraphics.clear();
        }
      },
      repeat: 99,  // Repeat 99 times means its executed 100 times
    });
  }

  drawCooldownArc() {
    const radius = 20;
    this.cooldownGraphics.clear();
    this.cooldownGraphics.lineStyle(3, 0x880000, 1);
    this.cooldownGraphics.beginPath();
    this.cooldownGraphics.arc(this.position.x, this.position.y+4, radius, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad((360 * this.fireCooldownProgress / 100) - 90), false);
    this.cooldownGraphics.strokePath();
  }
}
