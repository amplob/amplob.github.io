import { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

const FlagGuessingGame = () => {
  // State variables
  const [flag, setFlag] = useState(null); // Current flag to guess
  const [options, setOptions] = useState([]); // Options for the player to choose from
  const [score, setScore] = useState(0); // Player's score
  const [tries, setTries] = useState(0); // Number of attempts
  const [gameOver, setGameOver] = useState(false); // Whether the game is over

  // Effect to fetch a new flag or end the game based on the number of tries
  useEffect(() => {
    if (tries < 6) {
      fetchNewFlag(); // Fetch a new flag if the game is not over
    } else {
      setGameOver(true); // End the game if the maximum number of tries is reached
    }
  }, [tries]);

  // Function to fetch a new flag and options
  const fetchNewFlag = async () => {
    // Fetch all civilizations from the database
    const { data: civs, error } = await supabase.from('civs').select('*');

    if (error) {
      console.error('Error fetching civs:', error); // Log error if fetching fails
      return;
    }

    // Select a random flag from the fetched civilizations
    const randomFlag = civs[Math.floor(Math.random() * civs.length)];

    // Filter out the current flag to avoid repetition in options
    const filteredCivs = civs.filter(civ => civ.id !== randomFlag.id);

    // Ensure there are enough civilizations to choose from
    if (filteredCivs.length < 3) {
      console.error('Not enough civilizations to choose from.'); // Log error if not enough options
      return;
    }

    // Select three random options from the filtered list
    const shuffledOptions = shuffleArray(filteredCivs).slice(0, 3);

    // Combine the three options with the correct flag and shuffle the final list
    const allOptions = shuffleArray([...shuffledOptions, randomFlag]);

    // Update state with the new flag and options
    setFlag(randomFlag);
    setOptions(allOptions);
  };

  // Function to handle option clicks
  const handleOptionClick = (selectedOption) => {
    if (selectedOption.id === flag.id) {
      setScore(score + 1); // Increase score if the guess is correct
      alert('Correct!'); // Notify the player
    } else {
      alert('Incorrect!'); // Notify the player if the guess is wrong
    }
    setTries(tries + 1); // Increment the number of tries
  };

  // Function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  // Render the game or game over screen based on the state
  if (gameOver) {
    return <GameOver score={score} />; // Show the game over screen if the game is over
  }

  return (
    <div className="game">
      <h2>Guess the Civilization</h2>

      {/* Display the current score and number of tries */}
      <div className="score-tries">
        <p>Score: {score} / {tries}</p>
      </div>

      {/* Display the flag to be guessed */}
      {flag && <img src={flag.flag_url} alt="Flag" style={{ width: '200px', height: 'auto' }} />}

      {/* Display the options for the player to choose from */}
      <div className="options">
        {options.map((option) => (
          <Button
            key={option.id} // Use option.id as the key for the button
            label={option.name}
            onClick={() => handleOptionClick(option)} // Handle button click
          />
        ))}
      </div>
    </div>
  );
};

// Button component
const Button = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

// GameOver component
const GameOver = ({ score }) => (
  <div className="game-over">
    <h2>Game Over</h2>
    <p>Your score is {score}/5</p>
    <button onClick={() => window.location.reload()}>Play Again</button> {/* Reload the page to restart the game */}
  </div>
);

export default FlagGuessingGame;
