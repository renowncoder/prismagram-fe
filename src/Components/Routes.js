import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import Auth from '../Routes/Auth';
import Feed from '../Routes/Feed';
import Explore from '../Routes/Explore';
import Profile from '../Routes/Profile';
import Search from '../Routes/Search';

const LoggedInRoutes = () => (
  <Switch>
    <Route exact path="/" component={Feed} />
    <Route path="/search" component={Search} />
    <Route path="/explore" component={Explore} />
    <Route path="/:username" component={Profile} />
    <Redirect from="*" to="/" />
  </Switch>
);

const LoggedOutRoutes = () => (
  <>
    <Route exact path="/" component={Auth} />
    <Redirect from="*" to="/" />
  </>
);

const AppRouter = ({ isLoggedIn }) =>
  isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />;

AppRouter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

export default AppRouter;
