import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "../auth0";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav role="navigation" className="navbar fixed-top navbar-light bg-light">
      <a className="navbar-brand" href="/">Traverbal</a>

      {isAuthenticated && (
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
      )}

      {!isAuthenticated && (
        <a className="nav-link ml-auto" href="#login" onClick={() => loginWithRedirect({})}>Log in/Sign up</a>
      )}

      {isAuthenticated && (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">Leaderboard <span className="sr-only">(current)</span></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#logout" onClick={() => logout()}>Log out</a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
