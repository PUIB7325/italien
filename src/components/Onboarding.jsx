import React from 'react';
import { Zap, Map, GraduationCap, ChevronRight } from 'lucide-react';
import './Onboarding.css';

const options = [
  {
    id: 'micro',
    title: 'Micro-leçons',
    description: '5–10 minutes par jour. Parfait pour les emplois du temps chargés.',
    icon: <Zap size={32} color="#FFD166" />,
    glowClass: 'micro-glow'
  },
  {
    id: 'thematic',
    title: 'Modules thématiques',
    description: 'Voyage, restaurant, travail. Apprenez ce dont vous avez besoin.',
    icon: <Map size={32} color="#60a5fa" />,
    glowClass: 'thematic-glow'
  },
  {
    id: 'structured',
    title: 'Cours structurés',
    description: 'Progression académique avec quiz et révisions détaillées.',
    icon: <GraduationCap size={32} color="#00C49A" />,
    glowClass: 'structured-glow'
  }
];

export default function Onboarding({ onSelect }) {
  return (
    <div className="onboarding-container">
      <header className="onboarding-header">
        <h1 className="onboarding-title">
          Dolce Vita
        </h1>
        <p className="onboarding-subtitle">
          Choisissez votre méthode d'apprentissage préférée pour commencer.
        </p>
      </header>

      <div className="cards-grid">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="card"
          >
            <div className={`card-glow ${option.glowClass}`} />
            
            <div className="icon-wrapper">
              {option.icon}
            </div>
            
            <div>
              <h3 className="card-title">
                {option.title}
              </h3>
              <p className="card-desc">
                {option.description}
              </p>
            </div>

            <div className="card-action">
              Commencer <ChevronRight size={16} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
