// game.js
import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Load assets here
    this.load.image('logo', 'assets/logo.png');
}

function create() {
    // Add assets to the game
    const logo = this.add.image(400, 300, 'logo');

    // Simple animation
    this.tweens.add({
        targets: logo,
        y: 500,
        duration: 2000,
        ease: 'Power2',
        yoyo: true,
        loop: -1
    });
}

function update() {
    // Game loop logic here
}
