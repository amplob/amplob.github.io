// src/utils.js

export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };
  
  export const formatDate = (year) => {
    return year < 0 ? `${-year} BC` : `${year} AD`;
  };
  