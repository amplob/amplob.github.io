import { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

const FlagGuessingGame = () => {
  // State variables
  const [allCivs, setAllCivs] = useState([]); // All civilizations from the database
  const [flag, setFlag] = useState(null); // Current flag to guess
  const [options, setOptions] = useState([]); // Options for the player to choose from
  const [score, setScore] = useState(0); // Player's score
  const [tries, setTries] = useState(0); // Number of attempts
  const [gameOver, setGameOver] = useState(false); // Whether the game is over
  const [feedback, setFeedback] = useState(null); // Feedback for correct/incorrect guesses
  const [highlightedOption, setHighlightedOption] = useState(null); // Option to be highlighted
  const maxTries = 5; // Maximum number of tries
  const nChoices = 4; // Number of choices to display

  // Fetch all civilizations once when the component mounts
  useEffect(() => {
    const fetchAllCivs = async () => {
      // Fetch civilizations from the database
      const { data: civs, error } = await supabase.from('civs').select('*');
      if (error) {
        console.error('Error fetching civs:', error); // Log error if fetch fails
      } else {
        // Store civilizations and mark them as unused and unguessed
        setAllCivs(civs.map(civ => ({ ...civ, used: false, guessedCorrectly: false })));
      }
    };

    fetchAllCivs(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Effect to fetch a new flag or end the game based on the number of tries
  useEffect(() => {
    if (tries < maxTries && allCivs.length > 0) {
      fetchNewFlag(); // Fetch a new flag if the game is not over
    } else if (tries >= maxTries) {
      setGameOver(true); // End the game if maximum tries reached
    }
  }, [tries, allCivs]); // Trigger this effect when `tries` or `allCivs` changes


  // Function to fetch a new flag and options
  const fetchNewFlag = () => {
    // Filter out civilizations that have been guessed correctly
    const availableCivs = allCivs.filter(civ => !civ.guessedCorrectly);

    if (availableCivs.length === 0) {
      setGameOver(true); // End game if no more civilizations to guess
      return;
    }

    // Randomly select a flag from the available civilizations
    const randomFlag = availableCivs[Math.floor(Math.random() * availableCivs.length)];

    // Shuffle all civilizations to use as options
    let allOptions = shuffleArray([...allCivs]);

    // Ensure the correct flag is in the options
    if (!allOptions.includes(randomFlag)) {
      allOptions[Math.floor(Math.random() * allOptions.length)] = randomFlag;
    }

    // Limit options to the specified number of choices
    allOptions = shuffleArray(allOptions).slice(0, nChoices);

    // Update state with the new flag and options
    setFlag(randomFlag);
    setOptions(allOptions);
    setFeedback(null); // Clear any previous feedback
    setHighlightedOption(null); // Clear any highlighted option
  };

  // Function to handle option clicks
  const handleOptionClick = (selectedOption) => {
    if (selectedOption.id === flag.id) {
      // Correct guess
      setScore(score + 1); // Increase score
      setFeedback({ id: selectedOption.id, message: 'Correct', color: 'green' });

      // Mark the flag as correctly guessed
      setAllCivs(prevCivs => prevCivs.map(civ => civ.id === flag.id ? { ...civ, guessedCorrectly: true } : civ));
      
      // Increment the number of tries after a short delay (0.5 seconds)
      setTimeout(() => {
        setTries(tries + 1);
      }, 500);
    } else {
      // Incorrect guess
      setFeedback({ id: selectedOption.id, message: 'Incorrect', color: 'red' });
      setHighlightedOption(flag.id); // Highlight the correct option
      
      // Increment the number of tries after a longer delay (1 second)
      setTimeout(() => {
        setTries(tries + 1);
      }, 1000);
    }
  };

  // Function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  // Function to format a year as BC or AD
  const formatDate = (year) => {
    return year < 0 ? `${-year} BC` : `${year} AD`;
  };

  // Render the game over screen if the game is over
  if (gameOver) {
    return <GameOver score={score} maxTries={maxTries} />;
  }

  // Render the game interface
  return (
    <div className="game">
      <h2>Guess the Civilization</h2>
      <div className="score-tries">
        <p>Score: {score} / {maxTries}</p>
      </div>
      {/* Display the flag to be guessed */}
      {flag && (
        <div>
          <img src={flag.flag_url} alt={flag.flag_url} style={{ width: '200px', height: 'auto' }} />
          <div className="dates">
            <p>Founded: {formatDate(flag.dateIni)}</p>
            <p>Fell: {formatDate(flag.dateEnd)}</p>
          </div>
        </div>
      )}
      {/* Display the options for the player to choose from */}
      <div className="options">
        {options.map((option) => (
          <div key={option.id} style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              label={option.name}
              onClick={() => handleOptionClick(option)}
              style={{
                backgroundColor: highlightedOption === option.id ? 'green' : '',
                transition: 'background-color 0.3s',
              }}
            />
            {feedback && feedback.id === option.id && (
              <span style={{ marginLeft: '10px', color: feedback.color }}>
                {feedback.message}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Button component
const Button = ({ label, onClick, style }) => (
  <button onClick={onClick} style={style}>{label}</button>
);

// GameOver component to display when the game ends
const GameOver = ({ score, maxTries }) => (
  <div className="game-over">
    <h2>Game Over</h2>
    <p>Your score is {score} / {maxTries}</p>
    <button onClick={() => window.location.reload()}>Play Again</button>
  </div>
);

export default FlagGuessingGame;
