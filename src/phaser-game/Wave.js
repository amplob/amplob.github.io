// Wave.js
import Enemy from './Enemy';

export default class Wave {
    constructor(scene, position, wavesData, onStartWave) {
      this.scene = scene;
      this.position = position;
      this.wavesData = wavesData; // Store all wave data
      this.currentWaveIndex = 0;
      this.onStartWave = onStartWave;
  
      // Create the button in the Phaser scene
      this.button = this.scene.add.image(position.x, position.y, 'waveButton')
        .setScale(0.2)
        .setInteractive();
  
      // Add event listener for button click
      this.button.on('pointerdown', () => {
        this.startNextWave();
      });
  
      this.enemyIcons = [];
      this.enemyWave = [];
    }
  
    updateWaveInfo() {
      const waveData = this.wavesData[this.currentWaveIndex];
  
      if (!Array.isArray(waveData)) {
        console.error('Expected waveData to be an array');
        return;
      }
  
      this.enemyWave = waveData;
      this.drawEnemyIcons();
    }
  
    drawEnemyIcons() {
      this.enemyIcons.forEach(icon => icon.destroy());
      this.enemyIcons = [];
  
      this.enemyWave.forEach((enemy, index) => {
        const icon = this.scene.add.image(this.position.x + index * 20, this.position.y - 30, enemy.type.icon).setScale(0.2);
        const text = this.scene.add.text(this.position.x + index * 20, this.position.y - 50, `x${enemy.count}`, { fontSize: '12px', fill: '#fff' });
        this.enemyIcons.push(icon, text);
      });
    }

    startNextWave() {
      if (this.scene.waveInProgress) return;
    
      this.scene.waveInProgress = true;
    
      if (!this.scene.enemies) {
        this.scene.enemies = [];
      }
    
      const wave = this.wavesData[this.currentWaveIndex].map(enemyData => ({ ...enemyData }));
      let totalEnemiesInWave = wave.reduce((total, enemyData) => total + enemyData.count, 0);
    
      this.scene.enemiesRemaining = totalEnemiesInWave;
      this.scene.enemiesToSpawn = totalEnemiesInWave;
    
      const screenSetup = this.scene.screenSetup;  // Assuming you initialize this in your scene
      const enemyPosition = screenSetup.getEnemyStartPosition();  // Get the enemy's start position
    
      this.scene.time.addEvent({
        delay: 1000,
        callback: () => {
          if (this.scene.enemiesToSpawn > 0 && wave.length > 0) {
            const enemyData = wave[0];
            if (enemyData && enemyData.count > 0) {
              const enemy = new Enemy(this.scene, enemyPosition.x, enemyPosition.y, enemyData.type);  // Use fixed enemy position
              this.scene.enemies.push(enemy);
              enemyData.count--;
              this.scene.enemiesToSpawn--;
            }
    
            if (enemyData.count <= 0) wave.shift();
          }
    
          if (this.scene.enemiesRemaining <= 0 && this.scene.enemiesToSpawn <= 0) {
            this.scene.waveInProgress = false;
            this.button.setVisible(true);
          }
        },
        loop: true,
      });
    
      this.button.setVisible(false);
      this.currentWaveIndex++;
    }
    
  
    setVisible(visible) {
      this.button.setVisible(visible);
      this.enemyIcons.forEach(icon => icon.setVisible(visible));
    }
  }