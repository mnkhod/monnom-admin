import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { Row, Col, Collapse } from "reactstrap"
import { Link, withRouter } from "react-router-dom"
import classname from "classnames"

//i18n
import { withTranslation } from "react-i18next"

import { connect } from "react-redux"

const Navbar = props => {
  let userRole = JSON.parse(localStorage.getItem("user_information"))?.user?.user_role
  
  
  const [statistics, set_statistics] = useState(false)
  const [manage_admins, set_manage_admins] = useState(false)
  const [content, set_content] = useState(false)
  const [news, set_news] = useState(false)

  useEffect(() => {
    var matchingMenuItem = null
    var ul = document.getElementById("navigation")
    var items = ul.getElementsByTagName("a")
    for (var i = 0; i < items.length; ++i) {
      if (props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  })
  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    if (parent) {
      parent.classList.add("active") // li
      const parent2 = parent.parentElement
      parent2.classList.add("active") // li
      const parent3 = parent2.parentElement
      if (parent3) {
        parent3.classList.add("active") // li
        const parent4 = parent3.parentElement
        if (parent4) {
          parent4.classList.add("active") // li
          const parent5 = parent4.parentElement
          if (parent5) {
            parent5.classList.add("active") // li
            const parent6 = parent5.parentElement
            if (parent6) {
              parent6.classList.add("active") // li
            }
          }
        }
      }
    }
    return false
  }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">                
                {/* ------------------- STATISTICS START ------------------- */}
                  {(userRole == 1 || userRole == 2) && (
                    <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle arrow-none"
                      onClick={e => {
                        e.preventDefault()
                        set_statistics(!statistics)
                      }}
                      to="dashboard"
                    >
                      <i className="bx bx-home-circle mr"></i>
                      {props.t("Статистик")} {props.menuOpen}
                      <div className="arrow-down"></div>
                    </Link>
                    <div
                      className={classname("dropdown-menu", { show: statistics })}
                    >
                      {userRole == 1 && (
                        <Link to="/dashboard" className="dropdown-item">
                          {props.t("Хянах самбар")}
                        </Link>
                      )}                      
                      <Link to="/sales" className="dropdown-item">
                        {props.t("Борлуулалт")}
                      </Link>
                    </div>
                  </li>
                  )} 
                {/* ------------------- STATISTICS END ------------------- */}
                {/* ------------------- BLOG PAGE START ------------------- */}
                {(userRole == 1 || userRole == 2) && (
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle arrow-none"
                      onClick={e => {
                        e.preventDefault()
                        set_news(!news)
                      }}
                      to="dashboard"
                    >
                      <i className="bx bx-home-circle mr"></i>
                      {props.t("Мэдээ мэдээлэл")} {props.menuOpen}
                      <div className="arrow-down"></div>
                    </Link>
                    <div
                      className={classname("dropdown-menu", { show: statistics })}
                    >
                      <Link to="/blogs-list" className="dropdown-item">
                        {props.t("Мэдээний жагсаалт")}
                      </Link>
                      {/* <Link to="/landing-admin" className="dropdown-item">
                        {props.t("Веб админ")}
                      </Link> */}
                    </div>
                  </li>
                )}
                {/* ------------------- BLOG PAGE END ------------------- */}
                {/* ------------------- ADMIN CONTROL START ------------------- */}
                {(userRole == 1 || userRole == 2 || userRole == 3) && (
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle arrow-none"
                      onClick={e => {
                        e.preventDefault()
                        set_manage_admins(!manage_admins)
                      }}
                      to="dashboard"
                    >
                      <i className="bx bx-home-circle mr"></i>
                      {props.t("Админы удирдлага")} {props.menuOpen}
                      <div className="arrow-down"></div>
                    </Link>
                    <div
                      className={classname("dropdown-menu", {
                        show: manage_admins,
                      })}
                    >
                      {(userRole == 1 || userRole == 6) && (
                        <Link to="/manage-admins" className="dropdown-item">
                          {props.t("Ажилчид")}
                        </Link>  
                      )}
                      {(userRole == 1 || userRole == 2) && (
                        <Link to="/app-users" className="dropdown-item">
                          {props.t("Хэрэглэгчид")}
                        </Link>  
                      )}       
                      {(userRole == 1 || userRole == 3) && (
                        <Link to="/delivery" className="dropdown-item">
                          {props.t("Хүргэлтийн мэдээлэл")}
                        </Link>  
                      )}                                     
                      {(userRole == 1 || userRole == 6) && (
                        <Link to="/settings" className="dropdown-item">
                          {props.t("Тохиргоо")}
                        </Link>
                      )}                                            
                    </div>
                  </li>
                )}
                {/* ------------------- ADMIN CONTROL END ------------------- */}
                {/* ------------------- CONTENT START ------------------- */}
                  {(userRole == 1 || userRole == 2 || userRole == 4 || userRole == 5) && (
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          set_content(!content)
                        }}
                        to="dashboard"
                      >
                        <i className="bx bx-home-circle mr"></i>
                        {props.t("Контент")} {props.menuOpen}
                        <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: content })}
                      >
                        {(userRole == 1 || userRole == 2 || userRole == 5) && (
                          userRole == 5 ? 
                          <Link to="#" className="dropdown-item">
                            {props.t("Ном")}
                          </Link> : <Link to="books-list" className="dropdown-item">
                          {props.t("Ном")}
                        </Link>  
                        )} 
                        {(userRole == 1 || userRole == 2 || userRole == 4) && (
                          userRole == 4 ? 
                          <Link to="#" className="dropdown-item">
                            {props.t("Подкаст")}
                          </Link> : <Link to="podcastsList" className="dropdown-item">
                          {props.t("Подкаст")}
                        </Link>
                        )}                        
                        {userRole == 1 || userRole == 2 && (
                          <Link to="/live-list" className="dropdown-item">
                            {props.t("Радио")}
                          </Link>
                        )}                          
                      </div>
                    </li>
                  )}                
                {/* ------------------- CONTENT END ------------------- */}
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  )
}

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout
  return { leftMenu }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
)
