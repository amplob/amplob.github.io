// Dragon.js
import Phaser from 'phaser';

class Dragon {
    constructor(scene, x, y) {
      this.scene = scene;
      this.sprite = scene.physics.add.sprite(x, y, 'dragon');
      this.hp = 100;
      this.strength = 10;
      this.intimidation = 5;
      this.speed = 5;
      this.magic = 2;
    }
  
    // Dragon's actions
    plunderVillage() {
      const foodGained = Phaser.Math.Between(10, 30);
      const goldGained = Phaser.Math.Between(20, 50);
      this.scene.resourceManager.updateResource('food', foodGained);
      this.scene.resourceManager.updateResource('gold', goldGained);
      this.scene.village.increaseAnger(10);
      console.log("Plundered a village, gained food and gold.");
    }
  
    kidnapVirgin() {
      const virginsGained = 1;
      this.scene.resourceManager.updateResource('virgins', virginsGained);
      this.scene.village.increaseFame(15);
      console.log("Kidnapped a virgin, fame increased.");
    }
  
    rest() {
      this.hp = Math.min(this.hp + 20, 100);
      console.log("Dragon rested, restored health.");
    }
  
    levelUp(attribute, cost) {
      if (this.scene.resourceManager[attribute] >= cost) {
        this[attribute] += 1;
        this.scene.resourceManager.updateResource(attribute, -cost);
        console.log(`Leveled up ${attribute}`);
      } else {
        console.log("Not enough resources to level up.");
      }
    }
  }
  
  export default Dragon;
  