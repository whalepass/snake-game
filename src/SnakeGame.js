import React, { useState, useEffect } from 'react';
import './SnakeGame.css';

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

    useEffect(() => {
        const interval = setInterval(() => {
            if (!gameOver) {
                moveSnake();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [snake, direction, gameOver]);

    const handleKeyPress = (e) => {
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

    const getQuestsAndRewards = () => {
        return [
            { quest: "Level 1 (200 XP)", reward: "Snake Fancy Hat"},
            { quest: "Level 2 (400 XP)", reward: "Snake Silly Hat"},
            { quest: "Level 3 (600 XP)", reward: "Snake Cyber Hat"},
            { quest: "Level 4 (800 XP)", reward: "Snake Cowboy Hat"},
            { quest: "Level 5 (999 XP)", reward: "Snake Turban Hat + 500 Snake Oil"},
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
                <h2>Quests & Rewards</h2>
                <ul>
                    {getQuestsAndRewards().map((item, index) => (
                        <li key={index}>
                            <strong>Quest:</strong> {item.quest} <br />
                            <strong>Reward:</strong> {item.reward}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SnakeGame;
