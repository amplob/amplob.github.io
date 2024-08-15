import { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';


const FlagGuessingGame = () => {
  const [flag, setFlag] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (tries < 4) {
      fetchNewFlag();
    } else {
      setGameOver(true);
    }
  }, [tries]);

  const fetchNewFlag = async () => {
    const { data: civs, error } = await supabase
      .from('civs')
      .select('*');

    if (error) {
      console.error('Error fetching civs:', error);
      return;
    }

    const randomFlag = civs[Math.floor(Math.random() * civs.length)];
    const shuffledOptions = shuffleArray(civs)
      .slice(0, 3)
      .concat(randomFlag)
      .sort(() => Math.random() - 0.5);

    setFlag(randomFlag);
    setOptions(shuffledOptions);
  };

  const handleOptionClick = (selectedOption) => {
    if (selectedOption.id === flag.id) {
      setScore(score + 1);
      alert('Correct!');
    } else {
      alert('Incorrect!');
    }
    setTries(tries + 1);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  if (gameOver) {
    return <GameOver score={score} />;
  }

  return (
    <div className="game">
      <h2>Guess the Civilization</h2>
      {flag && <img src={flag.flag_url} alt="Flag" style={{ width: '200px', height: 'auto' }} />}
      <div className="options">
        {options.map((option) => (
          <Button
            key={option.id}
            label={option.name}
            onClick={() => handleOptionClick(option)}
          />
        ))}
      </div>
    </div>
  );
};

const Button = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

const GameOver = ({ score }) => (
  <div className="game-over">
    <h2>Game Over</h2>
    <p>Your score is {score}/5</p>
    <button onClick={() => window.location.reload()}>Play Again</button>
  </div>
);

export default FlagGuessingGame;
