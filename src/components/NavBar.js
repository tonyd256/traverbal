import React from "react";
import { useAuth0 } from "../auth0";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav role="navigation" className="navbar fixed-top navbar-light bg-light">
      <a className="navbar-brand" href="/">Traverbal</a>
      {!isAuthenticated && (
        <button className="btn btn-link ml-auto" onClick={() => loginWithRedirect({})}>Log in</button>
      )}

      {isAuthenticated && <button className="btn btn-link ml-auto" onClick={() => logout()}>Log out</button>}
    </nav>
  );
};

export default NavBar;
