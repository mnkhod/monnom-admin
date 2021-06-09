import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"

// users
import user1 from "../../../assets/images/users/avatar-1.jpg"

const ProfileMenu = props => {
   // Declare a new state variable, which we'll call "menu"
   const [menu, setMenu] = useState(false)

   const [username, setusername] = useState("")
   const [userPic, setUserPic] = useState(null)

   useEffect(() => {
      if (localStorage.getItem("authUser")) {
         if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            const obj = JSON.parse(localStorage.getItem("authUser"))
            setusername(obj.displayName)
         } else if (process.env.REACT_APP_DEFAULTAUTH === "fake" || process.env.REACT_APP_DEFAULTAUTH === "jwt") {
            const obj = JSON.parse(localStorage.getItem("authUser"))
            setusername(obj.username)
         }
      }
   }, [props.success])

   useEffect(() => {
      setusername(JSON.parse(localStorage.getItem("user_information")).user.username)
      setUserPic(JSON.parse(localStorage.getItem("user_information")).user?.profile_picture?.url)
   }, [])

   return (
      <React.Fragment>
         <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block">
            <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
               <img className="rounded-circle header-profile-user" src={process.env.REACT_APP_STRAPI_BASE_URL + userPic} alt="pro" />
               <span className="d-none d-xl-inline-block ml-2 mr-1">{username}</span>
               <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
            </DropdownToggle>
            <DropdownMenu right>
               {/* <DropdownItem tag="a" href="/profile">
            {" "}
            <i className="bx bx-user font-size-16 align-middle mr-1"/>
            {props.t("Profile")}{" "}
          </DropdownItem>
          <DropdownItem tag="a" href="/crypto-wallet">
            <i className="bx bx-wallet font-size-16 align-middle mr-1"/>
            {props.t("My Wallet")}
          </DropdownItem>
          <DropdownItem tag="a" href="#">
            <span className="badge badge-success float-right">11</span>
            <i className="mdi mdi-settings font-size-17 align-middle mr-1"/>
            {props.t("Settings")}
          </DropdownItem>
          <DropdownItem tag="a" href="auth-lock-screen">
            <i className="bx bx-lock-open font-size-16 align-middle mr-1"/>
            {props.t("Lock screen")}
          </DropdownItem>
          <div className="dropdown-divider"/> */}
               <Link to="/logout" className="dropdown-item">
                  <i className="bx bx-power-off font-size-16 align-middle mr-1 text-danger" />
                  <span>{props.t("Logout")}</span>
               </Link>
            </DropdownMenu>
         </Dropdown>
      </React.Fragment>
   )
}

ProfileMenu.propTypes = {
   success: PropTypes.any,
   t: PropTypes.any,
}

const mapStatetoProps = state => {
   const { error, success } = state.Profile
   return { error, success }
}

export default withRouter(connect(mapStatetoProps, {})(withTranslation()(ProfileMenu)))
