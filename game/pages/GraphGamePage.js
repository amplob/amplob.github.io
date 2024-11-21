// pages/GraphGamePage.js
import React from 'react';
import GraphComponent from '../components/GraphComponent';

const GraphGamePage = () => {
  return (
    <div className="page graph-game">
      <GraphComponent numNodes={10} avgConnectivity={3} />
    </div>
  );
};

export default GraphGamePage;