import React, { useState, useEffect } from 'react';
import './SnakeGame.css';
import axios from 'axios';

const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState('RIGHT');
    const [speed, setSpeed] = useState(200);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const gridSize = 20;
    const cellSize = 30;

    const getRandomCoordinates = () => {
        const min = 1;
        const max = gridSize - 1;
        const x = Math.floor(Math.random() * (max - min + 1)) + min;
        const y = Math.floor(Math.random() * (max - min + 1)) + min;
        return { x, y };
    };

    const moveSnake = () => {
        const newSnake = [...snake];
        let head = newSnake[newSnake.length - 1];

        switch (direction) {
            case 'RIGHT':
                head = { x: head.x + 1, y: head.y };
                break;
            case 'LEFT':
                head = { x: head.x - 1, y: head.y };
                break;
            case 'UP':
                head = { x: head.x, y: head.y - 1 };
                break;
            case 'DOWN':
                head = { x: head.x, y: head.y + 1 };
                break;
            default:
                break;
        }

        newSnake.push(head);

        if (head.x === food.x && head.y === food.y) {
            setFood(getRandomCoordinates());
            setScore(score + 10); // Increment score by 10 points for each food eaten
        } else {
            newSnake.shift();
        }

        if (
            head.x < 0 || head.x >= gridSize ||
            head.y < 0 || head.y >= gridSize ||
            newSnake.slice(0, -1).some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            setGameOver(true);
        }

        setSnake(newSnake);
    };

    const restartGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood({ x: 15, y: 15 });
        setDirection('RIGHT');
        setSpeed(200);
        setScore(0);
        setGameOver(false);
    };

    const getRedirect = () => {
        const gameId = "77c6eda1-be06-451b-a261-dadb53664299";
        let playerId = localStorage.getItem('playerId');

        axios.get(`https://api.whalepass.gg/players/${playerId}/redirect?gameId=${gameId}`, {
            headers: {
                "X-API-KEY": "ac8e74e54e2c292553fdf53f9568b27d",
                "X-Battlepass-Id": "d6558dda-7cb6-41fc-bae4-d25c6393e1ec"
            }
        })
        .then(response => {
          console.log('Enrollment successful:', response.data);
          window.open(response.data.redirectionLink);
        })
        .catch(error => {
          console.error('Error during enrollment:', error);
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!gameOver) {
                moveSnake();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [snake, direction, gameOver]);

    const handleKeyPress = (e) => {
        e.preventDefault();
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'DOWN') setDirection('UP');
                break;
            case 'ArrowDown':
                if (direction !== 'UP') setDirection('DOWN');
                break;
            case 'ArrowLeft':
                if (direction !== 'RIGHT') setDirection('LEFT');
                break;
            case 'ArrowRight':
                if (direction !== 'LEFT') setDirection('RIGHT');
                break;
            default:
                break;
        }
    };

    const handleMobileControl = (newDirection) => {
        if (
            (newDirection === 'UP' && direction !== 'DOWN') ||
            (newDirection === 'DOWN' && direction !== 'UP') ||
            (newDirection === 'LEFT' && direction !== 'RIGHT') ||
            (newDirection === 'RIGHT' && direction !== 'LEFT')
        ) {
            setDirection(newDirection);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [direction]);

    useEffect(() => {
        // Check if 'playerId' is already set in localStorage
        let playerId = localStorage.getItem('playerId');
    
        // If 'playerId' is not set, generate one and save it to localStorage
        if (!playerId) {
          playerId = crypto.randomUUID();  // or use another method to generate playerId
          localStorage.setItem('playerId', playerId);
          console.log('Set new playerId:', playerId);
        } else {
          console.log('Existing playerId:', playerId);
        }
    
        // Set the gameId, assuming you have it from somewhere
        const gameId = "77c6eda1-be06-451b-a261-dadb53664299";  // Replace this with the actual game ID
    
        // Now make the POST request to enroll the player
        axios.post('https://api.whalepass.gg/enrollments', {
          playerId: playerId,
          gameId: gameId
        }, {
            headers: {
                "X-API-KEY": "1fab137e5fa57ad731cb510e41bfe595"
            }
        })
        .then(response => {
          console.log('Enrollment successful:', response.data);
        })
        .catch(error => {
          console.error('Error during enrollment:', error);
        });
        
      }, []); // Empty array ensures this effect runs only once on mount

      
    useEffect(() => {
        // Check if 'playerId' is already set in localStorage
        let playerId = localStorage.getItem('playerId');    
        // Set the gameId, assuming you have it from somewhere
        const gameId = "77c6eda1-be06-451b-a261-dadb53664299";  // Replace this with the actual game ID
    
        let challenge_id;

        if (score === 10) {
            challenge_id = "267d6330-c41c-457f-a712-6386d61e97a4";
        } else if (score === 50) {
            challenge_id = "f466c48c-d92d-41e0-a787-496377cfe019";
        } else if (score === 100) {
            challenge_id = "7d23095a-79db-4cfe-a0c2-8d9219fe7cd7";
        } else if (score === 200) {
            challenge_id = "af03589c-df90-4a86-9663-02dea1c86881";
        } else if (score === 300) {
            challenge_id = "34d61400-4341-41fd-a7d4-534abcd65395";
        } else if (score === 400) {
            challenge_id = "3c43cbd2-f94e-4bac-9113-2d641e067d08";
        } else if (score === 500) {
            challenge_id = "17dc91e5-3071-4001-adf0-9d3f44d92578";
        } else if (score === 600) {
            challenge_id = "910f7bc4-37a7-4776-a887-a16198df8da8";
        } else if (score === 700) {
            challenge_id = "6d2dddd9-35c3-43c8-82a2-b2acab4b8693";
        } else if (score === 800) {
            challenge_id = "efdde190-0a88-4e07-bc33-7d64056d6223";
        } else if (score === 900) {
            challenge_id = "66970e2f-5441-4611-96d2-b681042da16d";
        } else {
            return;
        }

        // Now make the POST request to enroll the player
        axios.post(`https://api.whalepass.gg/players/${playerId}/progress/challenge`, {
          gameId: gameId,
          challengeId: challenge_id
        }, {
            headers: {
                "X-API-KEY": "1fab137e5fa57ad731cb510e41bfe595",
                "X-Battlepass-Id": "d6558dda-7cb6-41fc-bae4-d25c6393e1ec"
            }
        })
        .then(response => {
          console.log('Challenge completed successfully:', response.data);
        })
        .catch(error => {
          console.error('Error during challenge completion:', error);
        });
        
      }, [score]); // Empty array ensures this effect runs only once on mount

      const getQuestsAndRewards = () => {
        return [
            { quest: "Get a score of 100", reward: "50 Snake oil"},
            { quest: "Get a score of 200", reward: "100 Snake oil"},
            { quest: "Get a score of 300", reward: "100 Snake oil"},
            { quest: "Get a score of 400", reward: "100 Snake oil"},
            { quest: "Get a score of 500", reward: "100 Snake oil"},
            { quest: "Get a score of 600", reward: "100 Snake oil"},
            { quest: "Get a score of 700", reward: "100 Snake oil"},
            { quest: "Get a score of 800", reward: "100 Snake oil"},
            { quest: "Get a score of 900", reward: "100 Snake oil"},
        ]
        // if (score >= 50) {
        //     return [
        //         { quest: "Collect 5 more food items", reward: "Double Score!" },
        //         { quest: "Survive for 2 minutes", reward: "Speed Boost" }
        //     ];
        // } else if (score >= 20) {
        //     return [
        //         { quest: "Collect 3 more food items", reward: "Extra Life" },
        //         { quest: "Reach a score of 50", reward: "Unlock New Skin" }
        //     ];
        // } else {
        //     return [
        //         { quest: "Eat 1 more food item", reward: "5 Extra Points" },
        //         { quest: "Survive for 30 seconds", reward: "Increase Speed" }
        //     ];
        // }
    };
    const getLevelsAndRewards = () => {
        return [
            { quest: "Level 1 (200 XP)", reward: "Snake Fancy Hat"},
            { quest: "Level 2 (400 XP)", reward: "Snake Silly Hat"},
            { quest: "Level 3 (600 XP)", reward: "Snake Cyber Hat"},
            { quest: "Level 4 (800 XP)", reward: "Snake Cowboy Hat"},
            { quest: "Level 5 (999 XP)", reward: "Snake Turban Hat + 500 Snake oil"}
        ];
    };

    return (
        <div className="snake-game-container">
            <div className="score-display">
                Score: <span className="score">{score}</span>
            </div>
            <div className="game-area">
                {gameOver ? (
                    <>
                        <div className="game-over">Game Over<p>Use arrow keys to play</p></div>
                        <button className="restart-button" onClick={restartGame}>Restart</button>
                        <button className="claim-button" onClick={getRedirect}>Claim My Rewards</button>
                    </>
                ) : (
                    <>
                        <div className="snake">
                            {snake.map((segment, index) => (
                                <div key={index} className="snake-segment" style={{
                                    left: `${segment.x * cellSize}px`,
                                    top: `${segment.y * cellSize}px`,
                                }}></div>
                            ))}
                        </div>
                        <div className="food" style={{
                            left: `${food.x * cellSize}px`,
                            top: `${food.y * cellSize}px`,
                        }}></div>
                    </>
                )}
            </div>
            <div className="mobile-controls">
                <button onClick={() => handleMobileControl('UP')}>↑</button>
                <div>
                    <button onClick={() => handleMobileControl('LEFT')}>←</button>
                    <button onClick={() => handleMobileControl('DOWN')}>↓</button>
                    <button onClick={() => handleMobileControl('RIGHT')}>→</button>
                </div>
            </div>
            <div className="quests-and-rewards">
                <h2>Challenges & Rewards</h2>
                <ul>
                    {getQuestsAndRewards().map((item, index) => (
                        <li key={index}>
                            <strong>Quest:</strong> {item.quest} <br />
                            <strong>Reward:</strong> {item.reward}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="lvls-and-rewards">
                <h2>Levels</h2>
                <ul>
                    {getLevelsAndRewards().map((item, index) => (
                        <li key={index}>
                            <strong> {item.quest} </strong><br />
                            <strong>Reward:</strong> {item.reward}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SnakeGame;
