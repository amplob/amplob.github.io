export default class Village {
    constructor(scene) {
      this.scene = scene;
      this.anger = 0;
      this.fame = 0;
    }
  
    increaseAnger(amount) {
      this.anger += amount;
      if (this.anger >= 100) {
        this.triggerRaid(); // Trigger a raid if anger is too high
      }
    }
  
    decreaseAnger(amount) {
      this.anger = Math.max(this.anger - amount, 0);
    }
  
    increaseFame(amount) {
      this.fame += amount;
      if (this.fame >= 100) {
        this.triggerKnightAttack(); // Trigger a knight attack if fame is too high
      }
    }
  
    triggerRaid() {
      console.log("Villagers are raiding your cave!");
      // Logic for triggering a raid
    }
  
    triggerKnightAttack() {
      console.log("A knight is attacking!");
      // Logic for triggering a knight attack
    }
  }
  