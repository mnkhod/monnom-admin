import PropTypes from "prop-types"
import React from "react"

import { Switch, BrowserRouter as Router } from "react-router-dom"
import { connect } from "react-redux"

// Import Routes all
import {
  userRoutes,
  authRoutes,
  managerRoutes,
  deliveryManRoutes,
  podcastPublisherRoutes,
  bookPulisherRoutes,
  constRoutes,
} from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

import { PopUp } from "./contexts/CheckActionsContext"

// Import scss
import "./assets/scss/theme.scss"

const App = props => {
  function getLayout() {
    let layoutCls = VerticalLayout

    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  const Layout = getLayout()
  return (
    <React.Fragment>
      <PopUp>
        <Router>
          <Switch>
            {authRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
              />
            ))}

            {userRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isAdminProtected={true}
                isManagerProtected={false}
                isDeliveryProtected={false}
                isBookProtected={false}
                isPodcastProtected={false}
                exact
              />
            ))}

            {managerRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isAdminProtected={false}
                isManagerProtected={true}
                isDeliveryProtected={false}
                isBookProtected={false}
                isPodcastProtected={false}
                exact
              />
            ))}

            {deliveryManRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
                isAdminProtected={false}
                isManagerProtected={false}
                isDeliveryProtected={true}
                isBookProtected={false}
                isPodcastProtected={false}
                exact
              />
            ))}

            {podcastPublisherRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isAdminProtected={false}
                isManagerProtected={false}
                isDeliveryProtected={false}
                isBookProtected={false}
                isPodcastProtected={true}
                exact
              />
            ))}

            {bookPulisherRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isAdminProtected={false}
                isManagerProtected={false}
                isDeliveryProtected={false}
                isBookProtected={true}
                isPodcastProtected={false}
                exact
              />
            ))}

            {constRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isAdminProtected={true}
                isManagerProtected={true}
                isDeliveryProtected={true}
                isBookProtected={true}
                isPodcastProtected={true}
                exact
              />
            ))}
          </Switch>
        </Router>
      </PopUp>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any,
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
