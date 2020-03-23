import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { useAuth0 } from "../auth0";
import useGlobalState from "../utils/GlobalState";

import "./Leaderboard.css";

const Leaderboard = props => {
  const { isAuthenticated, errorMsg } = useAuth0();
  const { cities, users, loading, imageUrl } = useGlobalState();

  if (errorMsg) {
    return <div className="text-danger">{errorMsg}</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <Link to="/about">What is this website?</Link>
          </div>
        </div>
        {isAuthenticated && (
          <div className="row">
            <div className="col text-center">
              <p>
                Cool, I'm in. Now what? Fill in your <Link to="/profile">profile</Link>,
                especially <strong>change your name so it's not your email!</strong>&nbsp;
                Select your traverballed cities by tapping on the icons below your profile.
                Then check out other's badges by clicking below.
              </p>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col text-center">
            <h2>Leaderboard</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <ul className="leaderboard">
              { _.reverse(_.sortBy(users, u => _.sum(Object.values(u.badges)))).map( (user, key) => (
                <li className="user" key={key}><Link to={`/profile/${user.id}`}>
                  <div>
                    <img
                      className="img-thumbnail rounded-circle"
                      src={`${user.picture || '/public/no_profile.gif'}?tr=w-50,h-50`}
                      srcSet={`${user.picture || '/public/no_profile.gif'}?tr=w-100,h-100 2x`}
                      alt={user.name} />
                    <span className="name">{`${user.name} (${user.city})`}</span>
                  </div>
                  <div className="badge-list">
                    { _.take(_.reverse(_.filter(_.sortBy(
                      Object.keys(user.badges)
                      .map( b => ({ key: b, value: user.badges[b] })), 'value'), b => b.value > 0)), 4)
                      .map( (b, i) => {
                        if (i < 3) {
                          const image = _.find(cities, { name: b.key }).image;
                          return (
                            <div className={`badge ${ i === 2 ? 'drop-sm' : ''} ${ i === 1 ? 'drop-xxs' : ''}`} key={i}>
                              <img
                                src={`${imageUrl}${image}?tr=w-60,h-60`}
                                srcSet={`${imageUrl}${image}?tr=w-120,h-120 2x`}
                                alt={b.key} />
                              <span className="text-primary">{`x${b.value}`}</span>
                            </div>
                          );
                        } else {
                          return (
                            <h3 key={i} className="text-primary drop-xs">+</h3>
                          );
                        }
                      })
                    }
                  </div>
                </Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Leaderboard;
