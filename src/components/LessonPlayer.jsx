import React, { useState } from 'react';
import { X, ArrowRight, RotateCw, Check, Volume2 } from 'lucide-react';
import './LessonPlayer.css';

export default function LessonPlayer({ lesson, onClose }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentSlide = lesson.slides[slideIndex];
  const progress = ((slideIndex + 1) / lesson.slides.length) * 100;

  const nextSlide = () => {
    if (slideIndex < lesson.slides.length - 1) {
      setSlideIndex(prev => prev + 1);
      // Reset states
      setFlipped(false);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      onClose(); // Finish lesson
    }
  };

  // Handle swipe gesture for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchEnd = (e) => setTouchEnd(e.changedTouches[0].clientX);

  const onTouchMove = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    
    // Swipe left = next slide
    if (distance > 50) {
      nextSlide();
      setTouchStart(null);
      setTouchEnd(null);
    }
    // Swipe right = previous slide
    if (distance < -50 && slideIndex > 0) {
      setSlideIndex(prev => prev - 1);
      setFlipped(false);
      setSelectedOption(null);
      setIsCorrect(null);
      setTouchStart(null);
      setTouchEnd(null);
    }
  };

  const handleOptionSelect = (index, correct) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setIsCorrect(correct);
  };

  const renderContent = () => {
    switch (currentSlide.type) {
      case 'intro':
        return (
          <div className="slide-content intro-slide text-center">
            <h2 className="slide-title mb-4">{currentSlide.title}</h2>
            <p className="slide-text text-lg text-muted">{currentSlide.content}</p>
          </div>
        );
      
      case 'grammar':
        return (
          <div className="slide-content grammar-slide">
             <h2 className="slide-title mb-4">{currentSlide.title}</h2>
             <div className="grammar-box">
                {currentSlide.content.split('\n').map((line, i) => (
                  <p key={i} className="grammar-line">{line}</p>
                ))}
             </div>
          </div>
        );

      case 'flashcard':
        return (
          <div className="slide-content flashcard-slide">
             <div 
               className={`flashcard ${flipped ? 'flipped' : ''}`} 
               onClick={() => setFlipped(!flipped)}
             >
                <div className="card-face front">
                  <span className="text-3xl font-bold">{currentSlide.front}</span>
                  <div className="mt-4 text-sm text-primary flex items-center gap-2">
                    <RotateCw size={16} /> Toucher pour retourner
                  </div>
                </div>
                <div className="card-face back">
                  <span className="text-2xl font-bold mb-2">{currentSlide.back}</span>
                  <div className="pronunciation flex items-center gap-2 text-muted">
                    <Volume2 size={18} />
                    {currentSlide.pronunciation}
                  </div>
                  {currentSlide.context && (
                    <p className="mt-4 text-sm text-center opacity-80 italic">
                      "{currentSlide.context}"
                    </p>
                  )}
                </div>
             </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="slide-content quiz-slide w-full max-w-md">
            <h3 className="text-xl font-bold mb-6 text-center">{currentSlide.question}</h3>
            <div className="options-grid flex flex-col gap-3">
              {currentSlide.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx, opt.correct)}
                  className={`quiz-option ${
                    selectedOption === idx 
                      ? (opt.correct ? 'correct' : 'wrong') 
                      : (selectedOption !== null && opt.correct ? 'correct' : '')
                  }`}
                  disabled={selectedOption !== null}
                >
                  {opt.text}
                  {selectedOption === idx && (
                    <span className="ml-auto">
                      {opt.correct ? <Check size={20} /> : <X size={20} />}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {selectedOption !== null && (
               <div className={`mt-4 text-center font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                 {isCorrect ? 'Correct !' : 'Oups...'}
               </div>
            )}
          </div>
        );

      case 'success':
        return (
          <div className="slide-content success-slide text-center">
            <div className="mb-6 text-yellow-400">
               <Check size={64} className="mx-auto" />
            </div>
            <h2 className="text-3xl font-bold mb-4">{currentSlide.title}</h2>
            <p className="text-xl">{currentSlide.content}</p>
          </div>
        );

      default:
        return <div>Unknown slide type</div>;
    }
  };

  // Determine if "Continue" button should be enabled
  const canContinue = () => {
    if (currentSlide.type === 'quiz') return selectedOption !== null;
    return true; // Intro, flashcard, grammar, success can always continue
  };

  return (
    <div 
      className="lesson-overlay animate-fade-in"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      <div className="lesson-header">
        <button onClick={onClose} className="close-btn"><X size={24} /></button>
        <div className="progress-track">
          <div className="progress-thumb" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="w-6"></div> {/* Spacer */}
      </div>

      <div className="lesson-body text-white">
        {renderContent()}
      </div>

      <div className="lesson-footer">
        <button 
          className={`continue-btn ${canContinue() ? '' : 'disabled'}`}
          onClick={nextSlide}
          disabled={!canContinue()}
        >
          {slideIndex === lesson.slides.length - 1 ? 'Terminer' : 'Continuer'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
