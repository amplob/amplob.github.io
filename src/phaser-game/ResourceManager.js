export default class ResourceManager {
    constructor(scene) {
      this.scene = scene;
      this.gold = 0;
      this.food = 0;
      this.virgins = 0;
      this.magic = 0;
  
      // UI elements to track resources
      this.goldText = scene.add.text(50, 50, 'Gold: 0', { fontSize: '20px', fill: '#fff' });
      this.foodText = scene.add.text(50, 70, 'Food: 0', { fontSize: '20px', fill: '#fff' });
      this.virginsText = scene.add.text(50, 90, 'Virgins: 0', { fontSize: '20px', fill: '#fff' });
      this.magicText = scene.add.text(50, 110, 'Magic: 0', { fontSize: '20px', fill: '#fff' });
    }
  
    updateResource(resource, amount) {
      this[resource] += amount;
      this.updateUI();
    }
  
    updateUI() {
      this.goldText.setText('Gold: ' + this.gold);
      this.foodText.setText('Food: ' + this.food);
      this.virginsText.setText('Virgins: ' + this.virgins);
      this.magicText.setText('Magic: ' + this.magic);
    }
  }
  