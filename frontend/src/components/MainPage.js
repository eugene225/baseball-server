import React from 'react';
import Navbar from './Navbar';
import './MainPage.css';

function MainPage() {
  const teams = [
    'team1.png', 'team2.png', 'team3.png', 'team4.png', 'team5.png',
    'team6.png', 'team7.png', 'team8.png', 'team9.png', 'team10.png'
  ];

  return (
    <div>
      <Navbar />
      <div className="main-content">
        <div className="logo-grid">
          {teams.map((team, index) => (
            <img key={index} src={`/assets/teamLogos/${team}`} alt={`Team ${index + 1}`} className="team-logo" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
