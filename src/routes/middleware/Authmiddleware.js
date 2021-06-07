import React from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"

const Authmiddleware = ({ component: Component, layout: Layout, isAuthProtected, isAdminProtected, isManagerProtected, isDeliveryProtected, isBookProtected, isPodcastProtected, ...rest }) => (
   <Route
      {...rest}
      render={props => {
         //  console.log(Component)
         if (isAuthProtected && (!localStorage.getItem("isAuthenticated") || localStorage.getItem("user_information") == null)) {
            console.log("local storage is null")
            return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
         }
         if (isAuthProtected) {
            let userRole = JSON.parse(localStorage.getItem("user_information"))?.user?.user_role
            console.log(userRole == 1)
            // console.log(`user role ${userRole}`)
            // console.log(isAdminProtected, isManagerProtected, isDeliveryProtected, isBookProtected, isPodcastProtected)
            if (isAdminProtected && userRole == 1) {
               return (
                  <Layout>
                     <Component {...props} />
                  </Layout>
               )
            } else if (isManagerProtected && (userRole == 1 || userRole == 2)) {
               return (
                  <Layout>
                     <Component {...props} />
                  </Layout>
               )
            } else if (isBookProtected && (userRole == 5 || userRole == 1 || userRole == 2)) {
               return (
                  <Layout>
                     <Component {...props} />
                  </Layout>
               )
            } else if (isPodcastProtected && (userRole == 4 || userRole == 1 || userRole == 2)) {
               return (
                  <Layout>
                     <Component {...props} />
                  </Layout>
               )
            } else if (isDeliveryProtected && (userRole == 3 || userRole == 1 || userRole == 2)) {
               return (
                  <Layout>
                     <Component {...props} />
                  </Layout>
               )
            } else {
               return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
            }
         } else {
            return (
               <Layout>
                  <Component {...props} />
               </Layout>
            )
         }
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
