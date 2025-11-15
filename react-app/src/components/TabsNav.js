import React from 'react';

function TabsNav({ currentTab, onTabChange }) {
  return (
    <nav className="tabs-nav">
      <div className="container">
        <button
          className={`tab-btn ${currentTab === 'discover' ? 'active' : ''}`}
          onClick={() => onTabChange('discover')}
        >
          Odkrywaj
        </button>
        <button
          className={`tab-btn ${currentTab === 'for-you' ? 'active' : ''}`}
          onClick={() => onTabChange('for-you')}
        >
          Dla Ciebie
        </button>
      </div>
    </nav>
  );
}

export default TabsNav;
