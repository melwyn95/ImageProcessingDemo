import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { HEADER_TITLE } from './constants';
import Header from './components/Header';
import MainContent from './components/MainContent';

import UploadJob from './pages/UploadJob';
import ShowResult from './pages/ShowResult';

import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Header title={HEADER_TITLE}/>
      <MainContent>
        <Route exact path="/" component={UploadJob}/>
        <Route exact path="/result/:jobId" component={ShowResult}/>
      </MainContent>
    </Router>
  );
}

export default App;
