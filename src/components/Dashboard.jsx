import React, { useState } from 'react';
import { ArrowLeft, Play, LayoutGrid, Award, Settings, Lock, CheckCircle, Clock } from 'lucide-react';
import { contentData } from '../data/italianContent';
import LessonPlayer from './LessonPlayer';
import './Dashboard.css';

export default function Dashboard({ format, onBack }) {
  const [activeTab, setActiveTab] = useState('learn');
  const [currentLesson, setCurrentLesson] = useState(null);
  
  // Get data based on format
  const currentData = contentData[format] || contentData.micro;
  const { title, subtitle, items } = currentData;

  const renderCard = (item, index) => {
    // Determine card specific visuals based on format
    const isMicro = format === 'micro';
    const Icon = item.icon;

    return (
      <div 
        key={item.id} 
        className={`glass-panel content-card ${item.locked ? 'locked' : ''} animate-fade-in`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="card-header">
          <div className={`icon-box ${isMicro ? 'circle' : 'square'}`}>
            <Icon size={24} />
          </div>
          {item.locked && <Lock size={16} className="lock-icon" />}
        </div>
        
        <div className="card-body">
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>

        <div className="card-footer">
          {isMicro ? (
            <span className="meta-tag"><Clock size={14} /> {item.duration}</span>
          ) : (
             <span className="meta-tag">{item.count || item.chapters + ' chapitres'}</span>
          )}
          
          <button 
            className={`play-btn ${item.locked ? 'disabled' : ''}`}
            onClick={() => !item.locked && item.slides ? setCurrentLesson(item) : null}
          >
            <Play size={16} fill="currentColor" />
          </button>
        </div>
      </div>
    );
  };

  if (currentLesson) {
    return <LessonPlayer lesson={currentLesson} onClose={() => setCurrentLesson(null)} />;
  }

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">DV</div>
        <div className="nav-items">
          <button 
            className={`nav-item ${activeTab === 'learn' ? 'active' : ''}`}
            onClick={() => setActiveTab('learn')}
          >
            <LayoutGrid size={24} />
          </button>
          <button 
            className={`nav-item ${activeTab === 'awards' ? 'active' : ''}`}
            onClick={() => setActiveTab('awards')}
          >
            <Award size={24} />
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={24} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <button onClick={onBack} className="back-btn">
            <ArrowLeft size={20} /> Changer de méthode
          </button>
          <div className="user-profile">
            <span className="xp-badge">✨ 120 XP</span>
            <div className="avatar">P</div>
          </div>
        </header>

        <section className="hero-section">
          <div className="hero-text">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
          </div>
          
          <div className="hero-action">
            <button 
              className="btn-primary flex-center gap-2 large-btn"
              onClick={() => items[0].slides && setCurrentLesson(items[0])}
            >
              <Play size={24} fill="currentColor" />
              Continuer: {items[0].title}
            </button>
          </div>
        </section>

        <section className="content-grid-wrapper">
           <h2 className="section-title">Votre Progression</h2>
           <div className="content-grid">
             {items.map((item, idx) => renderCard(item, idx))}
           </div>
        </section>
      </main>
    </div>
  );
}
