// Dragon.js
import Phaser from 'phaser';

class Dragon {
    constructor(scene, x, y) {
      this.scene = scene;
      this.sprite = scene.physics.add.sprite(x, y, 'dragon');
      this.sprite.setScale(0.1);
      this.hp = 100;
      this.strength = 10;
      this.intimidation = 5;
      this.speed = 5;
      this.magic = 200;
    }
  
    // Dragon's actions

// Dragon.js

fireballAttack() {
    // Create the fireball at the dragon's position
    const fireball = this.scene.physics.add.sprite(this.sprite.x, this.sprite.y, 'fireball');
    fireball.setScale(0.04);
  
    // Set the fireball's velocity to move right
    fireball.setVelocityX(300); // Adjust speed as needed
  
    // Use overlap for each enemy individually, to make sure they react when the fireball passes them
    this.scene.enemies.forEach((enemy) => {
        // Check for overlap between the fireball and each enemy
        this.scene.physics.add.overlap(fireball, enemy.sprite, () => {
            // If the enemy is alive and the fireball passes
            if (enemy.hp > 0) {
                enemy.takeDamage(this.magic); // Deal damage based on dragon's magic stat
                console.log(`Fireball hit enemy: ${enemy.type}, HP: ${enemy.hp}`);
            }
        });
    });
  
    // Destroy the fireball when it reaches the rightmost part of the scene
    fireball.update = () => {
      if (fireball.x >= this.scene.sys.game.config.width) {
        fireball.destroy();
      }
    };
  }

  attackEnemy(enemy) {
    enemy.takeDamage(this.strength);
  }

  takeDamage(damage) {
    this.hp -= damage;
    
  }

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
  