import React, { Fragment } from "react";

const About = () => (
  <Fragment>
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <h1>About</h1>
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          <p>
            This is site intended to motivate November Project members from
            around the world to tele-commute or traverbal virtually to other
            cities' workouts. It's simple and honesty based so don't mess
            around! Have fun with it and I hope it motivates you to workout with
            other cities!
          </p>
          <p>
            Signup and Login are passwordless. This meeans that we just use your
            email to verify you and that gets you in. We don't use your email
            for anything else. All you data is securely stored with the service,
            Auth0.
          </p>
        </div>
      </div>
    </div>
  </Fragment>
);

export default About;
