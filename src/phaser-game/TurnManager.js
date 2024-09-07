import Phaser from 'phaser';
export class TurnManager {
    constructor(scene) {
      this.scene = scene;
      this.actions = ['Plunder Village', 'Kidnap Virgin', 'Rest', 'Level Up'];
    }
  
    startTurn() {
      const choice = this.getPlayerChoice(); // Simulate player choice for now
  
      switch (choice) {
        case 'Plunder Village':
          this.scene.dragon.plunderVillage();
          break;
        case 'Kidnap Virgin':
          this.scene.dragon.kidnapVirgin();
          break;
        case 'Rest':
          this.scene.dragon.rest();
          break;
        case 'Level Up':
          this.scene.dragon.levelUp('strength', 20); // Example leveling up strength
          break;
        default:
          console.log("Invalid choice");
      }
  
      this.endTurn();
    }
  
    getPlayerChoice() {
      // Placeholder for actual player input
      return Phaser.Math.RND.pick(this.actions);
    }
  
    endTurn() {
      // After player action, resolve any events (like raids or attacks)
      console.log("Turn ended.");
    }
  }
  