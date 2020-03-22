import React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import { useAuth0 } from './auth0';
import NavBar from './components/NavBar';
import Profile from "./components/Profile";
import ProfileView from "./components/ProfileView";
import Leaderboard from "./components/Leaderboard";
import About from "./components/About";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";

import './App.css';

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router history={history}>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path="/" exact component={Leaderboard} />
          <PrivateRoute path="/profile" exact component={Profile} />
          <Route path="/profile/:id" exact component={ProfileView} />
          <Route path="/about" exact component={About} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
