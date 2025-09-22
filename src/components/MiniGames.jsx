import React, { useState, useEffect } from 'react';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';

const MiniGames = ({ db, userId, userName, t, playHeartBeatSound }) => {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameResults, setGameResults] = useState([]);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  // Love Memory Game - Juego de Memoria Romántica
  const LoveMemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    const loveEmojis = ['💕', '💖', '💗', '💘', '💝', '💞', '💟', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🤎', '🖤'];

    const initializeGame = () => {
      const gameCards = [...loveEmojis, ...loveEmojis]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({ id: index, emoji, isFlipped: false }));
      setCards(gameCards);
      setFlippedCards([]);
      setMatchedCards([]);
      setMoves(0);
      setGameComplete(false);
    };

    const handleCardClick = (cardId) => {
      if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) return;

      const newFlippedCards = [...flippedCards, cardId];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        setMoves(moves + 1);
        const [firstCard, secondCard] = newFlippedCards;
        const firstCardData = cards.find(card => card.id === firstCard);
        const secondCardData = cards.find(card => card.id === secondCard);

        if (firstCardData.emoji === secondCardData.emoji) {
          setMatchedCards([...matchedCards, firstCard, secondCard]);
        playHeartBeatSound();
          if (matchedCards.length + 2 === cards.length) {
            setGameComplete(true);
          }
      } else {
          setTimeout(() => {
            setFlippedCards([]);
          }, 1000);
        }
      }
    };

    return (
      <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
        <h4 className="text-white font-bold text-lg mb-4 text-center">💕 Juego de Memoria Romántica</h4>
        
        {!cards.length ? (
          <button
            onClick={initializeGame}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full font-medium hover:scale-105 transition-transform duration-200"
          >
            Comenzar Juego 💕
          </button>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-white text-sm">Movimientos: {moves}</span>
              <span className="text-pink-300 text-sm">Emparejadas: {matchedCards.length / 2}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {cards.map(card => (
            <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all duration-300 ${
                    flippedCards.includes(card.id) || matchedCards.includes(card.id)
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.emoji : '💖'}
            </button>
          ))}
        </div>

            {gameComplete && (
              <div className="text-center text-green-400 font-bold text-lg mb-4">
                🎉 ¡Felicidades! ¡Ganaste! 💕
              </div>
            )}

            <button
              onClick={initializeGame}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-full font-medium hover:scale-105 transition-transform duration-200"
            >
              Juego Nuevo 🔄
            </button>
          </div>
        )}
              </div>
    );
  };

  // Love Story Builder - Constructor de Historia de Amor
  const LoveStoryBuilder = () => {
    const [story, setStory] = useState([]);
    const [currentSentence, setCurrentSentence] = useState('');
    const [gameStarted, setGameStarted] = useState(false);

    const storyPrompts = [
      "En un hermoso día soleado...",
      "Nos conocimos por primera vez...",
      "Tus ojos eran...",
      "Me dijiste...",
      "Tu risa era...",
      "Te amé porque...",
      "El recuerdo más hermoso contigo...",
      "Espero que seamos...",
      "Te amo más que...",
      "Estaremos juntos para siempre..."
    ];

    const startGame = () => {
      setGameStarted(true);
      setStory([]);
      setCurrentSentence('');
    };

    const addSentence = () => {
      if (currentSentence.trim()) {
        setStory([...story, currentSentence]);
        setCurrentSentence('');
        playHeartBeatSound();
      }
    };

    const saveStory = () => {
      const gamesRef = ref(db, 'loveStories');
      push(gamesRef, {
        story: story.join(' '),
        author: userName || 'Guest',
        timestamp: serverTimestamp(),
        userId: userId
      });
      alert('¡Su historia romántica ha sido guardada! 💕');
    };

    return (
      <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
        <h4 className="text-white font-bold text-lg mb-4 text-center">📖 Constructor de Historia de Amor</h4>
        
        {!gameStarted ? (
              <div className="text-center">
            <p className="text-white text-sm mb-4">¡Escriban su historia de amor juntos frase por frase!</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-full font-medium hover:scale-105 transition-transform duration-200"
            >
              Comenzar Historia 💕
            </button>
              </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-pink-300 text-sm mb-2">Siguiente frase:</p>
              <p className="text-white text-xs mb-2">{storyPrompts[story.length % storyPrompts.length]}</p>
              <textarea
                value={currentSentence}
                onChange={(e) => setCurrentSentence(e.target.value)}
                placeholder="Escribe tu frase aquí..."
                className="w-full bg-white/20 backdrop-blur-sm placeholder-white/70 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300 resize-none"
                rows="2"
              />
              <button
                onClick={addSentence}
                disabled={!currentSentence.trim()}
                className="mt-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-full font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar Frase ✨
              </button>
            </div>

            {story.length > 0 && (
              <div className="mb-4">
                <h5 className="text-white font-medium mb-2">Su historia hasta ahora:</h5>
                <div className="bg-white/10 p-3 rounded-xl max-h-32 overflow-y-auto">
                  <p className="text-white text-sm leading-relaxed">{story.join(' ')}</p>
            </div>
          </div>
        )}

            <div className="flex gap-2">
              <button
                onClick={saveStory}
                disabled={story.length === 0}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-full font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar Historia 💾
              </button>
              <button
                onClick={startGame}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-full font-medium hover:scale-105 transition-transform duration-200"
              >
                Historia Nueva 🔄
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Love Guessing Game - Juego de Adivinanza Romántica
  const LoveGuessingGame = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [currentWord, setCurrentWord] = useState('');
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    const loveWords = [
      'amor', 'beso', 'abrazo', 'romance', 'cita', 'regalo', 'rosa', 'corazón',
      'ojos', 'risa', 'sueño', 'esperanza', 'felicidad', 'calor', 'ternura', 'emoción'
    ];

    const startGame = () => {
      const randomWord = loveWords[Math.floor(Math.random() * loveWords.length)];
      setCurrentWord(randomWord);
      setGuessedLetters([]);
      setWrongGuesses(0);
      setGameComplete(false);
      setGameWon(false);
      setGameStarted(true);
    };

    const guessLetter = (letter) => {
      if (guessedLetters.includes(letter) || gameComplete) return;

      setGuessedLetters([...guessedLetters, letter]);

      if (!currentWord.includes(letter)) {
        setWrongGuesses(wrongGuesses + 1);
        if (wrongGuesses + 1 >= 6) {
          setGameComplete(true);
          setGameWon(false);
        }
      } else {
        // Check if all letters are guessed
        const allLettersGuessed = currentWord.split('').every(char => 
          guessedLetters.includes(char) || char === letter
        );
        if (allLettersGuessed) {
          setGameComplete(true);
          setGameWon(true);
          playHeartBeatSound();
        }
      }
    };

    const displayWord = () => {
      return currentWord.split('').map((letter, index) => (
        <span key={index} className="text-2xl font-bold text-white mx-1">
          {guessedLetters.includes(letter) ? letter : '_'}
        </span>
      ));
    };

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return (
      <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
        <h4 className="text-white font-bold text-lg mb-4 text-center">🤔 Juego de Adivinanza Romántica</h4>
        
        {!gameStarted ? (
          <div className="text-center">
            <p className="text-white text-sm mb-4">¡Adivina una palabra romántica letra por letra!</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-full font-medium hover:scale-105 transition-transform duration-200"
            >
              Comenzar Juego 💕
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <div className="text-white text-sm mb-2">Palabra:</div>
              <div className="flex justify-center mb-4">
                {displayWord()}
              </div>
              <div className="text-pink-300 text-sm">
                Errores: {wrongGuesses}/6
        </div>
            </div>

            {!gameComplete && (
              <div className="grid grid-cols-6 gap-2 mb-4">
                {alphabet.split('').map(letter => (
                  <button
                    key={letter}
                    onClick={() => guessLetter(letter)}
                    disabled={guessedLetters.includes(letter)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      guessedLetters.includes(letter)
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            )}

            {gameComplete && (
              <div className="text-center">
                <div className={`text-2xl font-bold mb-4 ${
                  gameWon ? 'text-green-400' : 'text-red-400'
                }`}>
                  {gameWon ? '🎉 ¡Felicidades! ¡Ganaste! 💕' : '😢 ¡Se acabaron los intentos!'}
                </div>
                <div className="text-white text-sm mb-4">
                  La palabra era: <span className="font-bold">{currentWord}</span>
                </div>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-full font-medium hover:scale-105 transition-transform duration-200"
                >
                  Juego Nuevo 🔄
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Love Quiz Game
  const LoveQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    const questions = [
      {
        question: "What's the most romantic thing you can do together?",
        options: ["Watch a sunset", "Cook together", "Dance in the rain", "All of the above"],
        correct: 3
      },
      {
        question: "What color represents love?",
        options: ["Blue", "Red", "Green", "Yellow"],
        correct: 1
      },
      {
        question: "What's the best way to show you care?",
        options: ["Buy expensive gifts", "Spend quality time", "Send text messages", "Ignore them"],
        correct: 1
      }
    ];

    const handleAnswer = (answerIndex) => {
      if (answerIndex === questions[currentQuestion].correct) {
        setScore(score + 1);
        playHeartBeatSound();
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizComplete(true);
      }
    };

    const resetQuiz = () => {
      setCurrentQuestion(0);
      setScore(0);
      setQuizComplete(false);
    };

    if (quizComplete) {
      return (
        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 text-center">
          <h4 className="text-white font-bold text-lg mb-4">💕 Love Quiz Complete!</h4>
          <div className="text-4xl mb-4">
            {score === questions.length ? '💖' : score >= questions.length / 2 ? '💕' : '💔'}
          </div>
          <div className="text-white mb-4">
            You scored {score} out of {questions.length}!
          </div>
          <div className="text-pink-300 text-sm mb-4">
            {score === questions.length ? 'Perfect! You know love! 💖' : 
             score >= questions.length / 2 ? 'Great job! 💕' : 'Keep learning about love! 💔'}
          </div>
          <button
            onClick={resetQuiz}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform duration-200"
          >
            Play Again 💕
          </button>
        </div>
      );
    }

    return (
      <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
        <h4 className="text-white font-bold text-lg mb-4 text-center">💕 Love Quiz</h4>
        <div className="mb-4">
          <div className="text-white text-sm mb-2">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-white font-medium mb-4">
          {questions[currentQuestion].question}
        </div>
        
        <div className="space-y-2">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full bg-white/20 text-white p-3 rounded-lg hover:bg-white/30 transition-all duration-200 text-left"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md bg-white/15 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-white drop-shadow-lg">{t.miniGames || 'Mini Games'}</h3>
      </div>
      
      <div className="space-y-4">
        {!currentGame && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCurrentGame('memory')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-xl font-medium hover:scale-105 transition-transform duration-200"
            >
              💕<br />Juego de Memoria
            </button>
            <button
              onClick={() => setCurrentGame('story')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-xl font-medium hover:scale-105 transition-transform duration-200"
            >
              📖<br />Constructor de Historia
            </button>
            <button
              onClick={() => setCurrentGame('quiz')}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-xl font-medium hover:scale-105 transition-transform duration-200"
            >
              💕<br />Prueba de Amor
            </button>
            <button
              onClick={() => setCurrentGame('guessing')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl font-medium hover:scale-105 transition-transform duration-200"
            >
              🤔<br />Juego de Adivinanza
            </button>
          </div>
        )}

        {currentGame === 'memory' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentGame(null)}
                className="text-white hover:text-pink-300 transition-colors duration-200"
              >
                ← Volver a Juegos
              </button>
            </div>
            <LoveMemoryGame />
          </div>
        )}

        {currentGame === 'story' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentGame(null)}
                className="text-white hover:text-pink-300 transition-colors duration-200"
              >
                ← Volver a Juegos
              </button>
            </div>
            <LoveStoryBuilder />
          </div>
        )}

        {currentGame === 'quiz' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentGame(null)}
                className="text-white hover:text-pink-300 transition-colors duration-200"
              >
                ← Volver a Juegos
              </button>
            </div>
            <LoveQuiz />
          </div>
        )}

        {currentGame === 'guessing' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentGame(null)}
                className="text-white hover:text-pink-300 transition-colors duration-200"
              >
                ← Volver a Juegos
              </button>
            </div>
            <LoveGuessingGame />
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniGames;
