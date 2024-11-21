import { useState, useEffect } from 'react';
import { useCivs } from '../hooks/useCivs';  // Custom hook to fetch civilizations
import { shuffleArray, formatDate } from '../utils';  // Utility functions
import '../styles/FlagGuessingGame.css'; //import custom styles

const FlagGuessingGame = () => {
  const { allCivs, setAllCivs } = useCivs();  // Fetch civilizations and setter from custom hook
  
  const [flag, setFlag] = useState(null);  // Current flag to guess
  const [options, setOptions] = useState([]);  // Options for the player to choose from
  const [score, setScore] = useState(0);  // Player's score
  const [tries, setTries] = useState(0);  // Number of attempts
  const [gameOver, setGameOver] = useState(false);  // Whether the game is over
  const [feedback, setFeedback] = useState(null);  // Feedback for correct/incorrect guesses
  const [highlightedOption, setHighlightedOption] = useState(null);  // Option to be highlighted
  const [incorrectOption, setIncorrectOption] = useState(null);  // Track the incorrect guessed option
  const maxTries = 5;  // Maximum number of tries
  const nChoices = 4;  // Number of choices to display

  // Effect to fetch a new flag or end the game based on the number of tries
  useEffect(() => {
    if (tries < maxTries && allCivs.length > 0 && !flag) {
      fetchNewFlag();  // Fetch a new flag if the game is not over and flag is not set
    } else if (tries >= maxTries) {
      setGameOver(true);  // End the game if maximum tries reached
    }
  }, [tries, allCivs]);  // Trigger this effect when `tries` or `allCivs` changes

  // Function to fetch a new flag and options
  const fetchNewFlag = () => {
    const availableCivs = allCivs.filter(civ => !civ.guessedCorrectly);
    if (availableCivs.length === 0) {
      setGameOver(true);  // End game if no more civilizations to guess
      return;
    }
    const randomFlag = availableCivs[Math.floor(Math.random() * availableCivs.length)];
    let randomFlagInOptions = shuffleArray([...allCivs]).slice(0, nChoices);
    console.log("this is the correct flag:" ,randomFlag);
    console.log("this is are the flags before checking for correct one in it:" ,randomFlagInOptions);

    if (!randomFlagInOptions.includes(randomFlag)) {
      randomFlagInOptions.pop();
      randomFlagInOptions.push(randomFlag);
    }
    console.log("this is are the flags after:" ,randomFlagInOptions);
    randomFlagInOptions = shuffleArray(randomFlagInOptions);
    setFlag(randomFlag);
    setOptions(randomFlagInOptions);
    setFeedback(null);
    setHighlightedOption(null);
    setIncorrectOption(null);  // Reset the incorrect option
  };
  
  const handleOptionClick = (selectedOption) => {
    if (selectedOption.id === flag.id) {
      setScore(score + 1);
      setFeedback({ id: selectedOption.id, message: 'Correct', color: 'green' });
      setAllCivs(prevCivs => prevCivs.map(civ => civ.id === flag.id ? { ...civ, guessedCorrectly: true } : civ));
    } else {
      setFeedback({ id: selectedOption.id, message: 'Incorrect', color: 'red' });
      setIncorrectOption(selectedOption.id);  // Set the incorrect option
    }
    setHighlightedOption(flag.id);  // Highlight the correct option
    setTimeout(() => {
      setTries(tries + 1);
      setFlag(null);  // Clear the flag to trigger a new fetch
    }, 1600);
  };

  if (gameOver) {
    return <GameOver score={score} maxTries={maxTries} />;
  }

  return (
    <div className="game">
      <h2>Guess the Civilization</h2>
      <div className="score-tries">
        <p>Score: {score} / {maxTries}</p>
      </div>
      {flag && (
        <div>
          <img src={flag.flag_url} alt={flag.flag_url} className="flag-image" />
          <div className="dates">
            <p>Rise: {formatDate(flag.dateIni)}</p>
            <p>Fall: {formatDate(flag.dateEnd)}</p>
          </div>
        </div>
      )}
      <div className="options">
        {options.map((option) => (
          <div key={option.id} style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              label={option.name}
              onClick={() => handleOptionClick(option)}
              style={{
                backgroundColor: 
                  highlightedOption === option.id ? 'green' : 
                  incorrectOption === option.id ? 'red' : '',
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

const Button = ({ label, onClick, style }) => (
  <button onClick={onClick} style={style}>{label}</button>
);

const GameOver = ({ score, maxTries }) => (
  <div className="game-over">
    <h2>Game Over</h2>
    <p>Your score is {score} / {maxTries}</p>
    <button onClick={() => window.location.reload()}>Play Again</button>
  </div>
);

export default FlagGuessingGame;
