import PropTypes from "prop-types"
import React, { useEffect } from "react"

// MetisMenu
import MetisMenu from "metismenujs"
import { withRouter } from "react-router-dom"
import { Link } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"

const SidebarContent = props => {
  let userRole = JSON.parse(localStorage.getItem("user_information"))?.user
    ?.user_role

  console.log("userRole")
  console.log(userRole)

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname

    const initMenu = () => {
      new MetisMenu("#side-menu")
      let matchingMenuItem = null
      const ul = document.getElementById("side-menu")
      const items = ul.getElementsByTagName("a")
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
  }, [props.location.pathname])

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement

    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      return false
    }
    return false
  }

  return (
    <React.Fragment>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {(userRole == 1 || userRole == 2) && (
            <>
              <li className="menu-title">{props.t("Статистик")} </li>
              {userRole === 1 && (
                <li>
                  <Link to="/dashboard" className=" waves-effect">
                    <i className="bx bxs-dashboard"></i>
                    <span>{props.t("Хянах самбар")}</span>
                  </Link>
                </li>
              )}

              <li>
                <Link to="/sales" className=" waves-effect">
                  <i className="bx bx-package"></i>
                  <span>{props.t("Борлуулалт")}</span>
                </Link>
              </li>
            </>
          )}

          {(userRole === 1 ||
            userRole === 2 ||
            userRole === 3 ||
            userRole === 6) && (
            <>
              <li className="menu-title">{props.t("Админы удирдлага")} </li>

              {(userRole === 1 || userRole === 6) && (
                <li>
                  <Link to="/manage-admins" className=" waves-effect">
                    <i className="dripicons-user-group"></i>
                    <span>{props.t("Ажилчид")}</span>
                  </Link>
                </li>
              )}
              {(userRole === 1 || userRole === 2) && (
                <li>
                  <Link to="/app-users" className=" waves-effect">
                    <i className="dripicons-user"></i>
                    <span>{props.t("Хэрэглэгчид")}</span>
                  </Link>
                </li>
              )}

              {(userRole === 3 || userRole === 1) && (
                <li>
                  <Link to="/delivery" className=" waves-effect">
                    <i className="bx bx-cart-alt"></i>
                    <span>{props.t("Хүргэлтийн мэдээлэл")}</span>
                  </Link>
                </li>
              )}

              {(userRole === 1 || userRole === 6) && (
                <li>
                  <Link to="/settings" className=" waves-effect">
                    <i className="bx bx-wrench"></i>
                    <span>{props.t("Тохиргоо")}</span>
                  </Link>
                </li>
              )}
            </>
          )}

          {(userRole === 1 ||
            userRole === 2 ||
            userRole === 4 ||
            userRole === 5) && (
            <>
              <li className="menu-title">{props.t("Контент")}</li>

              {(userRole === 1 || userRole === 2 || userRole === 5) && (
                <li>
                  <Link to="/books-list" className=" waves-effect">
                    <i className="bx bx-book"></i>
                    <span>{props.t("Ном")}</span>
                  </Link>
                </li>
              )}

              {(userRole === 1 || userRole === 2 || userRole === 4) && (
                <li>
                  <Link to="/podcastsList" className=" waves-effect">
                    <i className="bx bx-headphone"></i>
                    <span>{props.t("Подкаст")}</span>
                  </Link>
                </li>
              )}

              {(userRole === 1 || userRole === 2) && (
                <li>
                  <Link to="/live-list" className=" waves-effect">
                    <i className="bx bx-radio"></i>
                    <span>{props.t("Радио")}</span>
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
