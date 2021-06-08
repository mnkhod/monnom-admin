import React from "react"
import { Redirect } from "react-router-dom"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Website auth routes
import Dashboard from "../pages/Dashboard"
import PodcastList from "../pages/PodcastChart"
import PodcastSinglePage from "../pages/PodcastSingle"
import BookSinglePage from "../pages/BookAuthor"
import Sales from "../pages/Sales"
import LiveChannel from "../pages/LiveChannel"
import Settings from "../pages/Settings"
import Delivery from "../pages/Delivery"

import ManageAdmins from "../pages/ManageAdmins"
// import Login from "../pages/Authentication/Login"
import Customers from "../pages/Customers"
import Books from "../pages/Books/books-list"
import BlogSingle from "../pages/BlogSingle"
import BlogsList from "../pages/BlogsList"
import LandingAdmin from "../pages/LandingAdmin"

// import Logout from "../pages/Authentication/Logout"

const bookPulisherRoutes = [{ verbose: "Ном дэлгэрэнгүй", path: "/bookSingle/:id", component: BookSinglePage }]

const podcastPublisherRoutes = [{ verbose: "Подкаст дэлгэрэнгүй", path: "/podcastSingle/:id", component: PodcastSinglePage }]

const deliveryManRoutes = [{ verbose: "Хүргэлтийн мэдээлэл", path: "/delivery", component: Delivery }]

const managerRoutes = [
   { verbose: "Хэрэглэгчид", path: "/app-users", component: Customers },
   { verbose: "Борлуулалт", path: "/sales", component: Sales },
   { verbose: "Подкаст", path: "/podcastsList", component: PodcastList },
   { verbose: "Ном", path: "/books-list", component: Books },
   { verbose: "Радио", path: "/live-list", component: LiveChannel },
   { path: "/blogs-list", component: BlogsList },
   { path: "/blog/:id?", component: BlogSingle },
]

const userRoutes = [
   { verbose: "Тохиргоо", path: "/settings", component: Settings },
   { verbose: "Ажилчид", path: "/manage-admins", component: ManageAdmins },
   { verbose: "Хянөх самбар", path: "/dashboard", component: Dashboard },
]

const constRoutes = [
   {
      verbose: "",
      path: "/",
      exact: true,
      component: () => {
         console.log(typeof JSON.parse(localStorage.getItem("user_information"))?.user?.user_role)
         switch (JSON.parse(localStorage.getItem("user_information"))?.user?.user_role) {
            case "1": {
               console.log("switch 1")
               return <Redirect push to="/dashboard" />
            }
            case "2": {
               console.log("switch 2")
               return <Redirect push to="/app-users" />
            }
            case "3": {
               console.log("switch 3")
               return <Redirect push to="/delivery" />
            }
            case "4": {
               console.log("switch 4")
               return <Redirect push to={`/podcastSingle/${JSON.parse(localStorage.getItem("user_information"))?.user?.id}`} />
            }
            case "5": {
               console.log("switch 5")
               return <Redirect push to={`/bookSingle/${JSON.parse(localStorage.getItem("user_information"))?.user?.id}`} />
            }
            default: {
               console.log("switch 6")
               return <Redirect push to="/login" />
            }
         }
      },
   },
]

const authRoutes = [
   { verbose: "", path: "/logout", component: Logout },
   { verbose: "", path: "/login", component: Login },
]

export { userRoutes, authRoutes, managerRoutes, deliveryManRoutes, podcastPublisherRoutes, bookPulisherRoutes, constRoutes }
