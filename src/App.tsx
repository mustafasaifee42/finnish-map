import React from 'react';
import Map from  './map';
import './App.css';

function App() {
  return (
    <div className="App">
      <Map 
        width={window.innerWidth}
        height={window.innerHeight}
        scale={2000}
        translate={[50,3550]}
      />    
    </div>
  );
}

export default App;
