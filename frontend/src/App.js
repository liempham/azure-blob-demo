import React from 'react';
import Upload from './Upload';
import FileList from './FileList';

function App() {
  return (
    <div className="App">
      <h1>Azure Blob Storage File Upload</h1>
      <Upload />
      <FileList />
    </div>
  );
}

export default App;