import { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

const FlagGuessingGame = () => {
  const [allCivs, setAllCivs] = useState([]);
  const [flag, setFlag] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [highlightedOption, setHighlightedOption] = useState(null);
  const maxTries = 5;
  const nChoices = 4;

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

  useEffect(() => {
    if (tries < maxTries && allCivs.length > 0) {
      fetchNewFlag();
    } else if (tries >= maxTries) {
      setGameOver(true);
    }
  }, [tries, allCivs]);

  useEffect(() => {
    if (flag) {
      console.log(flag.flag_url); // Log the flag URL when the flag state is updated
    }
  }, [flag]); // This useEffect runs whenever `flag` changes

  const fetchNewFlag = () => {
    const availableCivs = allCivs.filter(civ => !civ.guessedCorrectly);

    if (availableCivs.length === 0) {
      setGameOver(true);
      return;
    }

    const randomFlag = availableCivs[Math.floor(Math.random() * availableCivs.length)];

    let allOptions = shuffleArray([...allCivs]);

    if (!allOptions.includes(randomFlag)) {
      allOptions[Math.floor(Math.random() * allOptions.length)] = randomFlag;
    }

    allOptions = shuffleArray(allOptions).slice(0, nChoices);

    setFlag(randomFlag);
    setOptions(allOptions);
    setFeedback(null);
    setHighlightedOption(null);
  };

  const handleOptionClick = (selectedOption) => {
    if (selectedOption.id === flag.id) {
      setScore(score + 1);
      setFeedback({ id: selectedOption.id, message: 'Correct', color: 'green' });

      setAllCivs(prevCivs => prevCivs.map(civ => civ.id === flag.id ? { ...civ, guessedCorrectly: true } : civ));
      
      setTimeout(() => {
        setTries(tries + 1);
      }, 500);
    } else {
      setFeedback({ id: selectedOption.id, message: 'Incorrect', color: 'red' });
      setHighlightedOption(flag.id);
      
      setTimeout(() => {
        setTries(tries + 1);
      }, 1000);
    }
  };

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
