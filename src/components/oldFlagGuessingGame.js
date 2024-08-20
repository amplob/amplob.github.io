import { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

const FlagGuessingGame = () => {
  const [allCivs, setAllCivs] = useState([]); // All civilizations from the database
  const [flag, setFlag] = useState(null); // Current flag to guess
  const [options, setOptions] = useState([]); // Options for the player to choose from
  const [score, setScore] = useState(0); // Player's score
  const [tries, setTries] = useState(0); // Number of attempts
  const [gameOver, setGameOver] = useState(false); // Whether the game is over
  const [feedback, setFeedback] = useState(null); // Feedback for correct/incorrect guesses
  const [highlightedOption, setHighlightedOption] = useState(null); // Option to be highlighted
  const maxTries = 5;

  // Fetch all civilizations once when the component mounts
  useEffect(() => {
    const fetchAllCivs = async () => {
      const { data: civs, error } = await supabase.from('civs').select('*');
      if (error) {
        console.error('Error fetching civs:', error);
      } else {
        setAllCivs(civs.map(civ => ({ ...civ, used: false, guessedCorrectly: false })));
      }
    };

    fetchAllCivs();
  }, []);

  // Effect to fetch a new flag or end the game based on the number of tries
  useEffect(() => {
    if (tries < maxTries && allCivs.length > 0) {
      fetchNewFlag();
    } else if (tries >= maxTries) {
      setGameOver(true);
    }
  }, [tries, allCivs]);

  // Function to fetch a new flag and options
  const fetchNewFlag = () => {
    const availableCivs = allCivs.filter(civ => !civ.guessedCorrectly);

    if (availableCivs.length === 0) {
      setGameOver(true);
      return;
    }

    const randomFlag = availableCivs[Math.floor(Math.random() * availableCivs.length)];
    const allOptions = shuffleArray(availableCivs).slice(0, availableCivs.length).slice(0, 3); // Take all available civs as options

    if (!allOptions.includes(randomFlag)) {
      allOptions[Math.floor(Math.random() * allOptions.length)] = randomFlag;
    }

    setFlag(randomFlag);
    setOptions(allOptions);
    setFeedback(null); 
    setHighlightedOption(null);
  };

  // Function to handle option clicks
  const handleOptionClick = (selectedOption) => {
    if (selectedOption.id === flag.id) {
      setScore(score + 1);
      setFeedback({ id: selectedOption.id, message: 'Correct', color: 'green' });

      setAllCivs(prevCivs => prevCivs.map(civ => civ.id === flag.id ? { ...civ, guessedCorrectly: true } : civ));
      setTimeout(() => {
        setTries(tries + 1); // Increment the number of tries after 0.5 seconds
      }, 500);
    } else {
      setFeedback({ id: selectedOption.id, message: 'Incorrect', color: 'red' });
      setHighlightedOption(flag.id); // Highlight the correct option
      setTimeout(() => {
        setTries(tries + 1);
      }, 1000); // Wait 1 second before loading the next flag
    }
  };

  // Function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const formatDate = (year) => {
    return year < 0 ? `${-year} BC` : `${year} AD`;
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
          <img src={flag.flag_url} alt="Flag" style={{ width: '200px', height: 'auto' }} />
          <div className="dates">
            <p>Founded: {formatDate(flag.dateIni)}</p>
            <p>Fell: {formatDate(flag.dateEnd)}</p>
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

// GameOver component
const GameOver = ({ score, maxTries }) => (
  <div className="game-over">
    <h2>Game Over</h2>
    <p>Your score is {score} / {maxTries}</p>
    <button onClick={() => window.location.reload()}>Play Again</button>
  </div>
);

export default FlagGuessingGame;
