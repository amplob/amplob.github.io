export default class ScreenSetup {
    constructor(originalWidth, originalHeight) {
      this.originalWidth = originalWidth;
      this.originalHeight = originalHeight;
      this.updateScreenSize(); // Call it here once during construction
    }
  
    // Method to get positions
    getDragonPosition() {
      return { x: 100 * this.scaleX, y: 600 * this.scaleY };
    }
  
    getEnemyStartPosition() {
      return { x: 800 * this.scaleX, y: 600 * this.scaleY }; // Ensure it matches the dragon vertically
    }
  
    getFireButtonPosition() {
      return { x: 120 * this.scaleX, y: 680 * this.scaleY };
    }
  
    getWaveButtonPosition() {
      return { x: 450 * this.scaleX, y: 450 * this.scaleY };
    }
  
    getGoldIndicatorPosition() {
      return { x: 90 * this.scaleX, y: 465 * this.scaleY };
    }
  
    // Ensure this is only called once, not in the update loop
    updateScreenSize() {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
  
      const aspectRatio = this.originalWidth / this.originalHeight;
      this.gameWidth = screenWidth;
      this.gameHeight = screenWidth / aspectRatio;
  
      if (this.gameHeight > screenHeight) {
        this.gameHeight = screenHeight;
        this.gameWidth = screenHeight * aspectRatio;
      }
  
      this.scaleX = this.gameWidth / this.originalWidth;
      this.scaleY = this.gameHeight / this.originalHeight;
    }
  
    getPosition(xPercent, yPercent) {
      return {
        x: this.gameWidth * xPercent,
        y: this.gameHeight * yPercent,
      };
    }
  
    // Example usage: getScaledSize for sprites
    getScaledSize(originalWidth, originalHeight) {
      return {
        width: originalWidth * this.scaleX,
        height: originalHeight * this.scaleY,
      };
    }
  }
  