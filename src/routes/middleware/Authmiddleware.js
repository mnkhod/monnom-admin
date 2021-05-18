import React from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if (
        isAuthProtected &&
        (!localStorage.getItem("isAuthenticated") ||
          localStorage.getItem("user_information") == null)
      ) {
        // if ()
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
      // if (isAuthProtected) {
      //   if (
      //     JSON.parse(localStorage.getItem("user_information")).user.user_role ==
      //     3
      //   )
      //     return (
      //       <Redirect
      //         to={{ pathname: "/delivery", state: { from: props.location } }}
      //       />
      //     )
      //   if (
      //     JSON.parse(localStorage.getItem("user_information")).user.user_role ==
      //     4
      //   )
      //     return (
      //       <Redirect
      //         to={{
      //           pathname: `/podcastSingle/${
      //             JSON.parse(localStorage.getItem("user_information")).user.id
      //           }`,
      //           state: { from: props.location },
      //         }}
      //       />
      //     )
      //   if (
      //     JSON.parse(localStorage.getItem("user_information")).user.user_role ==
      //     3
      //   )
      //     return (
      //       <Redirect
      //         to={{
      //           pathname: `/bookSingle/${
      //             JSON.parse(localStorage.getItem("user_information")).user.id
      //           }`,
      //           state: { from: props.location },
      //         }}
      //       />
      //     )
      // }

      return (
        <Layout>
          <Component {...props} />
        </Layout>
      )
    }}
  />
)

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
}

export default Authmiddleware
