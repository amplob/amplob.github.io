export class WaveButton {
    constructor(scene, position, onStartWave) {
      this.scene = scene;
      this.position = position;
      this.onStartWave = onStartWave;
      this.button = this.scene.add.image(position.x, position.y, 'waveButton').setScale(0.2).setInteractive();
  
      this.button.on('pointerdown', () => {
        if (typeof this.onStartWave === 'function') {
          this.onStartWave();
        }
      });
  
      this.enemyIcons = []; // Array to hold enemy icons
      this.enemyWave = []; // Initialize enemyWave as an empty array
    }
  
    updateWaveInfo(waveData) {
      // Ensure waveData is an array
      if (!Array.isArray(waveData)) {
        console.error('Expected waveData to be an array, but received:', waveData);
        return;
      }
  
      this.enemyWave = waveData; // Set the wave data
      this.drawEnemyIcons(); // Draw the updated enemy icons
    }
  
    drawEnemyIcons() {
      // Clear any existing enemy icons
      this.enemyIcons.forEach(icon => icon.destroy());
      this.enemyIcons = [];
  
      // Draw icons based on the wave data
      this.enemyWave.forEach((enemy, index) => {
        const icon = this.scene.add.image(this.position.x + index * 20, this.position.y - 30, enemy.type.icon).setScale(0.2);
        const text = this.scene.add.text(this.position.x + index * 20, this.position.y - 50, `x${enemy.count}`, { fontSize: '12px', fill: '#fff' });
        this.enemyIcons.push(icon, text);
      });
    }
  
    setVisible(visible) {
      this.button.setVisible(visible);
      this.enemyIcons.forEach(icon => icon.setVisible(visible));
    }
  }
  