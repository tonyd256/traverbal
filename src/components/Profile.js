import React, { useState, useRef, Fragment } from "react";
import { useAuth0 } from "../auth0";

const useProfileForm = callback => {
  const { user, setUser, getTokenSilently } = useAuth0();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [picture, setPicture] = useState(user.picture);
  const [city, setCity] = useState(user.user_metadata && user.user_metadata.city || '');
  const fileUploader = useRef(null);
  const [loadingImg, setLoadingImg] = useState(false);

  const handleSave = async e => {
    e.preventDefault();

    try {
      const accessToken = await getTokenSilently();

      const r = await fetch(`//localhost:3001/api/user`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: user.sub,
          name,
          email,
          user_metadata: {
            city,
          }
        })
      });
      const data = await r.json();
      setUser({ ...user, name: data.user.name, email: data.user.email });
    } catch (err) {
      console.error(err);
    }
  }

  const handleChangePhoto = e => {
    e.preventDefault();
    console.log(fileUploader);
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

      const res = await fetch('//localhost:3001/api/user/photoToken', {
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

      const r = await fetch(`//localhost:3001/api/user`, {
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

  return {
    handleSave,
    handleChangePhoto,
    handlePhoto,
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
  };
};

const Profile = props => {
  const { loading, user } = useAuth0();
  const { name, email, setName, setEmail, picture, city, setCity, handleSave, handleChangePhoto, handlePhoto, fileUploader, loadingImg } = useProfileForm();

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <img className="img-thumbnail rounded-circle w-25" src={`${picture}?tr=w-400,h-400`} alt="Profile" />
              { loadingImg ?
                <a className="btn btn-link" disabled>Uploading...</a>
                :
                <a className="btn btn-link" href="#" onClick={handleChangePhoto}>Change Photo</a>
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
              <button type="submit" onClick={handleSave} className="btn btn-primary">Save</button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Profile;
