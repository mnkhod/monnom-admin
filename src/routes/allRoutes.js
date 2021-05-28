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
import LandingAdmin from '../pages/LandingAdmin';

// import Logout from "../pages/Authentication/Logout"

const userRoutes = [
  { path: "/app-users", component: Customers },
  // { path: "/landing-admin", component: LandingAdmin },
  { path: "/blogs-list", component: BlogsList },
  { path: "/blog/:id?", component: BlogSingle },
  { path: "/settings", component: Settings },
  {
    path: "/manage-admins",
    component: ManageAdmins,
  },
  { path: "/dashboard", component: Dashboard },
  { path: "/delivery", component: Delivery },
  {
    path: "/sales",
    component: Sales,
  },
  {
    path: "/podcastsList",
    component: PodcastList,
  },
  {
    path: "/podcastSingle/:id",
    component: PodcastSinglePage,
  },
  { path: "/books-list", component: Books },
  {
    path: "/bookSingle/:id",
    component: BookSinglePage,
  },
  {
    path: "/live-list",
    component: LiveChannel,
  },
  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const authRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
]

export { userRoutes, authRoutes }
