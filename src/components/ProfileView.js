import React, { Fragment } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import useGlobalState from "../utils/GlobalState";

import "./ProfileView.css";

const ProfileView = props => {
  const { cities, users, loading } = useGlobalState();
  const { id } = useParams();
  const user = _.find(users, { id });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div>Could not find user.</div>;
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <img
              className="img-thumbnail rounded-circle profile-image"
              src={`${user.picture || '/public/no_profile.gif'}?tr=w-200,h-200`}
              srcSet={`${user.picture || '/public/no_profile.gif'}?tr=w-400,h-400 2x`}
              alt={user.name}
            />
          </div>
        </div>

        <div className="row">
          <div className="col text-center">
            <h2>{user.name}</h2>
            {user.city ? (
              <span>{user.city}</span>
            ) : ''}
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-lg">
            <h3 className="badges-title">Badges</h3>
          </div>
        </div>
        <div className="row">
          <ul className="col-lg" id="badges">
            { _.reverse(_.sortBy(
              Object.keys(user.badges)
              .map( b => ({ key: b, value: user.badges[b] })), 'value'))
              .reduce( (accum, b, i) => {
                if (b.value < 1) { return accum; }
                const c = _.find(cities, { name: b.key });
                if (!c) { return accum; }
                const image = c.image;
                return [ ...accum, (
                  <li className='badge' key={i}>
                    <img
                      src={`https://ik.imagekit.io/traverbal/${image}?tr=w-120,h-120`}
                      srcSet={`https://ik.imagekit.io/traverbal/${image}?tr=w-240,h-240 2x`}
                      alt={b.key} />
                    <span className="text-primary">{`x${b.value}`}</span>
                  </li>
                )];
              }, [])
            }
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default ProfileView;
