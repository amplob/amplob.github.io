const fetchNewFlag = () => {
  // Filter out civilizations that have been guessed correctly
  const availableCivs = allCivs.filter(civ => !civ.guessedCorrectly);
  
  if (availableCivs.length === 0) {
    setGameOver(true);  // End game if no more civilizations to guess
    return;
  }

  // Randomly select a flag from the available civilizations
  const randomFlag = availableCivs[Math.floor(Math.random() * availableCivs.length)];

  // Shuffle all civilizations to use as options
  let allOptions = shuffleArray([...allCivs]);

  // Ensure the correct flag is in the options
  const randomFlagInOptions = allOptions.some(option => option.id === randomFlag.id);
  
  if (!randomFlagInOptions) {
    // Ensure the correct flag is added to the options
    allOptions.pop();  // Remove the last item to make space if there are too many options
    allOptions.push(randomFlag);  // Add the correct flag
  }

  // Limit options to the specified number of choices
  allOptions = shuffleArray(allOptions).slice(0, nChoices);

  // Update state with the new flag and options
  setFlag(randomFlag);
  setOptions(allOptions);
  setFeedback(null);  // Clear any previous feedback
  setHighlightedOption(null);  // Clear any highlighted option
};
