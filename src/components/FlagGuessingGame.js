import { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

const FlagGuessingGame = () => {
  // State variables
  const [allCivs, setAllCivs] = useState([]); // All civilizations from the database
  const [flag, setFlag] = useState(null); // Current flag to guess
  const [options, setOptions] = useState([]); // Options for the player to choose from
  const [score, setScore] = useState(0); // Player's score
  const [gameOver, setGameOver] = useState(false); // Whether the game is over
  const [feedback, setFeedback] = useState(null); // Feedback for correct/incorrect guesses
  const [correctGuesses, setCorrectGuesses] = useState([]); // Track correct guesses

  // Fetch all civilizations once when the component mounts
  useEffect(() => {
    const fetchAllCivs = async () => {
      const { data: civs, error } = await supabase.from('civs').select('*');
      if (error) {
        console.error('Error fetching civs:', error);
      } else {
        setAllCivs(civs); // Store all civilizations
      }
    };

    fetchAllCivs();
  }, []);

  // Effect to fetch a new flag
  useEffect(() => {
    if (allCivs.length > 0) {
      selectNewFlag(); // Fetch the first flag on load and after each correct guess
    }
  }, [allCivs, correctGuesses]); // Re-run when correct guesses or all civs change

  // Function to fetch a new flag and options
  const selectNewFlag = () => {
    // Filter out civilizations that have been correctly guessed
    const availableCivs = allCivs.filter(civ => !correctGuesses.includes(civ.id));

    // If no more flags are available, end the game
    if (availableCivs.length === 0) {
      setGameOver(true);
      return;
    }

    // Select a random flag from the available civilizations
    const randomFlag = availableCivs[Math.floor(Math.random() * availableCivs.length)];
    console.log("Selected Flag:", randomFlag);


    // Filter out the current flag to avoid repetition in options
    const filteredCivs = allCivs.filter(civ => civ.id !== randomFlag.id);

    // Ensure there are enough civilizations to choose from
    if (filteredCivs.length < 3) {
      console.error('Not enough civilizations to choose from.');
      return;
    }

    // Select three random options from the filtered list
    const shuffledOptions = shuffleArray(filteredCivs).slice(0, 3);

    // Combine the three options with the correct flag and shuffle the final list
    const allOptions = shuffleArray([...shuffledOptions, randomFlag]);
    console.log("Options:", allOptions);

    // Update state with the new flag and options
    setFlag(randomFlag);
    setOptions(allOptions);
    setFeedback(null); // Clear previous feedback
  };

  // Function to handle option clicks
  const handleOptionClick = (selectedOption) => {
    if (selectedOption.id === flag.id) {
      setScore(score + 1); // Increase score if the guess is correct
      setFeedback({ id: selectedOption.id, message: 'Correct', color: 'green' });

      // Add the flag to the list of correct guesses
      setCorrectGuesses([...correctGuesses, flag.id]);
    } else {
      setFeedback({ id: selectedOption.id, message: 'Incorrect', color: 'red' });
    }

    setTimeout(() => {
      selectNewFlag(); // Load a new flag after the feedback
    }, 1000); // Wait 1 second before loading the next flag
  };

  // Function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  // Format dates
  const formatDate = (year) => {
    return year < 0 ? `${-year} BC` : `${year} AD`;
  };

  // Render the game or game over screen based on the state
  if (gameOver) {
    return <GameOver score={score} />;
  }

  return (
    <div className="game">
      <h2>Guess the Civilization</h2>

      {/* Display the current score */}
      <div className="score-tries">
        <p>Score: {score}</p>
      </div>

      {/* Display the flag to be guessed */}
      {flag && (
        <div>
          <img src={flag.flag_url} alt="Flag" style={{ width: '200px', height: 'auto' }} />
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
              onClick={() => handleOptionClick(option)} // Handle button click
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
const Button = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

// GameOver component
const GameOver = ({ score }) => (
  <div className="game-over">
    <h2>Game Over</h2>
    <p>Your score is {score}</p>
    <button onClick={() => window.location.reload()}>Play Again</button>
  </div>
);

export default FlagGuessingGame;
