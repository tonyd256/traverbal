import React, { useState, useRef, Fragment } from "react";
import { useAuth0 } from "../auth0";
import useGlobalState from "../utils/GlobalState";

import "./Profile.css";

const useProfileForm = callback => {
  const { user, setUser, getTokenSilently } = useAuth0();
  const { apiUrl } = useGlobalState();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [picture, setPicture] = useState(user.picture);
  const [badges, setBadges] = useState((user.user_metadata && user.user_metadata.badges) || {});
  const [city, setCity] = useState((user.user_metadata && user.user_metadata.city) || '');
  const fileUploader = useRef(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async e => {
    e.preventDefault();

    try {
      setSaving(true);
      const accessToken = await getTokenSilently();

      const r = await fetch(`${apiUrl}/api/user`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: user.sub,
          name: name.trim(),
          email: email.trim(),
          user_metadata: {
            city: city.trim(),
          }
        })
      });
      const data = await r.json();
      setName(data.user.name);
      setEmail(data.user.email);
      setCity(data.user.user_metadata.city);
      setUser({ ...user, name: data.user.name, email: data.user.email, user_metadata: { ...user.user_metadata, city: data.user.user_metadata.city } });
      setSaving(false);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  }

  const handleChangePhoto = e => {
    e.preventDefault();
    fileUploader.current.click();
  };

  const handlePhoto = async e => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingImg(true);

    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);

    try {
      const accessToken = await getTokenSilently();

      const res = await fetch(`${apiUrl}/api/user/photoToken`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
      });
      const authParams = await res.json();

      data.append('publicKey', 'public_r67kB7ICE/J2GEfxIYV+D6UNxDo=');
      data.append('fileName', 'profile.jpg');
      data.append('signature', authParams.signature);
      data.append('expire', authParams.expire);
      data.append('token', authParams.token);

      const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: data,
      });
      const ikJson = await ikRes.json();

      const r = await fetch(`${apiUrl}/api/user`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: user.sub,
          picture: ikJson.url,
        })
      });
      const json = await r.json();
      setUser({ ...user, picture: json.user.picture });
      setPicture(json.user.picture);
      setLoadingImg(false);
    } catch (err) {
      setLoadingImg(false);
      console.error(err);
    }
  };

  const handleBadgeClick = async e => {
    e.preventDefault();
    const city = e.target.dataset.city;
    if (!city) { return; }

    const newBadges = badges;
    if (newBadges[city]) {
      newBadges[city] += 1;
    } else {
      newBadges[city] = 1;
    }
    setBadges(newBadges);

    try {
      const accessToken = await getTokenSilently();

      const r = await fetch(`${apiUrl}/api/user`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: user.sub,
          user_metadata: {
            badges: newBadges,
          }
        })
      });
      const data = await r.json();
      setUser({ ...user, user_metadata: { ...user.user_metadata, badges: data.user.user_metadata.badges } });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBadgeRemove = async e => {
    e.preventDefault();
    const city = e.target.dataset.city;
    if (!city) { return; }

    const newBadges = badges;
    if (newBadges[city] && newBadges[city] > 0) {
      newBadges[city] -= 1;
    } else {
      return;
    }
    setBadges(newBadges);

    try {
      const accessToken = await getTokenSilently();

      const r = await fetch(`${apiUrl}/api/user`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: user.sub,
          user_metadata: {
            badges: newBadges,
          }
        })
      });
      const data = await r.json();
      setUser({ ...user, user_metadata: { ...user.user_metadata, badges: data.user.user_metadata.badges } });
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleSave,
    handleChangePhoto,
    handlePhoto,
    handleBadgeClick,
    handleBadgeRemove,
    name,
    setName,
    email,
    setEmail,
    picture,
    setPicture,
    city,
    setCity,
    fileUploader,
    loadingImg,
    badges,
    saving,
  };
};

const Profile = props => {
  const { loading, user } = useAuth0();
  const { name, email, setName, setEmail, picture, city, setCity, handleSave, handleChangePhoto, handlePhoto, fileUploader, loadingImg, handleBadgeClick, handleBadgeRemove, badges, saving } = useProfileForm();
  const { cities, loading: loadingCities, imageUrl } = useGlobalState();

  if (loadingCities || loading || !user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <img
              className="img-thumbnail rounded-circle profile-image"
              src={`${picture || '/public/no_profile.gif'}?tr=w-200,h-200`}
              srcSet={`${picture || '/public/no_profile.gif'}?tr=w-400,h-400 2x`}
              alt="Profile" />
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
              { loadingImg ?
                <a className="btn btn-link" href="#uploading" disabled>Uploading...</a>
                :
                <a className="btn btn-link" href="#change" onClick={handleChangePhoto}>Change Photo</a>
              }
            <input type="file" id="profile-photo" ref={fileUploader} onChange={handlePhoto} style={{display: "none"}} />
          </div>
        </div>

        <div className="row">
          <div className="col-sm">
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value) } />
              </div>
              <div className="form-group">
                <label htmlFor="city">Home NP City</label>
                <input type="text" className="form-control" id="city" value={city} onChange={e => setCity(e.target.value) } />
              </div>
              <button type="submit" onClick={handleSave} className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </form>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-lg">
            <h3 className="badges-title">Claim Your Badges!</h3>
            <p className="badges-desc">
              This is based on an honor system. This is a fun app meant to
              facilitate virtual traverballing within the November Project
              community. Please only claim badges for cities you've attended
              their virtual workout. Cheers!
            </p>
          </div>
        </div>
        <div className="row">
          <ul className="col-lg" id="badges">
            { cities.map( (city, i) =>
              <li key={i}>
                <a className={`add ${ badges[city.name] > 0 ? 'has' : '' }`} data-city={city.name} onClick={handleBadgeClick} href="#add">
                  <img
                    src={`${imageUrl}${city.image}?tr=w-120,h-120`}
                    srcSet={`${imageUrl}${city.image}?tr=w-240,h-240 2x`}
                    alt={city.name}
                  />
                  { badges[city.name] && badges[city.name] > 0 ?
                    <span className="text-primary">{`x${badges[city.name]}`}</span>
                  : ''}
                </a>
                { badges[city.name] && badges[city.name] > 0 ?
                  <a className="remove" data-city={city.name} onClick={handleBadgeRemove} href="#remove">-</a>
                : ''}
              </li>
            )}
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default Profile;
