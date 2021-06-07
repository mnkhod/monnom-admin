import React, { useEffect, useState } from "react"

import { Row, Col, Container, Label } from "reactstrap"
import { AvForm, AvInput, AvGroup, AvFeedback } from "availity-reactstrap-validation"

import { withRouter, Link, useHistory } from "react-router-dom"

import CarouselPage from "./CarouselPage"
import axios from "axios"

import logo from "../../assets/images/logo.png"
import { ResultPopUp } from "../../contexts/CheckActionsContext"
require("dotenv").config()

const Login = props => {
   const [state, set_state] = useContext(ResultPopUp)

   const history = useHistory()
   const [errorMessage, setErrorMessage] = useState("")
   const [username, setUsername] = useState("")
   const [password, setPassword] = useState("")

   const redirectTo = () => {
      history.push("/")
   }

   const login = () => {
      set_state({ loading: true })

      axios({
         headers: {
            "Content-Type": "application/json",
         },
         method: "post",
         url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/admin-login`,
         data: {
            identifier: username,
            password: password,
         },
      })
         .then(res => {
            set_state({ loading: false })
            if (res.data.response == "error") {
               throw new Error("")
            }
            setAuthenticated(res.data)
            redirectTo()
            setSessionPeriod()
            // document.cookie =
            // 	"username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";
            // redirectTo(res.data.data.role);
         })
         .catch(error => {
            set_state({ loading: false })
            setUsername("")
            setPassword("")
            setErrorMessage("Нэвтрэх нэр эсвэл нууц үг буруу")
         })
   }

   // Set authenticated status
   const setAuthenticated = obj => {
      localStorage.setItem("isAuthenticated", true)
      localStorage.setItem("user_information", JSON.stringify(obj))
   }

   // Set session delete period after 1 day
   const setSessionPeriod = () => {
      var a = new Date()
      a.setDate(a.getDate() + 1)

      localStorage.setItem("deleteAt", a.toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar" }))
   }

   const handleSumbit = (event, errors, values) => {
      if (errors.length == 0) {
         login()
      }
   }

   useEffect(() => {
      setPassword("")
      setUsername("")
   }, [])

   return (
      <React.Fragment>
         <div>
            <Container fluid className="p-0">
               <Row className="no-gutters">
                  <CarouselPage />

                  <Col xl={3}>
                     <div className="auth-full-page-content p-md-5 p-4">
                        <div className="w-100">
                           <div className="d-flex flex-column h-100">
                              <div className="mb-4 mb-md-5">
                                 <Link to="dashboard" className="d-block-logo">
                                    <img
                                       src={logo}
                                       alt=""
                                       height="200"
                                       className="auth-logo-dark"
                                       // style={{ color: "#000" }}
                                    />
                                    {/* <img
													src={logo}
													alt=""
													height="100"
													className="auth-logo-light"
												/> */}
                                 </Link>
                              </div>
                              <div className="my-auto">
                                 <div>
                                    <h5 className="text-primary">Тавтай морил !</h5>
                                    <p className="text-muted">
                                       Админы удирдлагын вэб нэвтрэх
                                       {/* <br />
                          {username}
                          <br />
                          {password} */}
                                    </p>
                                 </div>

                                 <div className="mt-4">
                                    <AvForm onSubmit={(a, b, c) => handleSumbit(a, b, c)}>
                                       <AvGroup>
                                          <Label for="username">Нэвтрэх нэр</Label>
                                          <AvInput placeholder="Нэвтрэх нэр оруулах" name="username" id="username" required onChange={e => setUsername(e.target.value)} />
                                          <AvFeedback>Нэвтрэх нэр оруулна уу !</AvFeedback>
                                       </AvGroup>

                                       <AvGroup>
                                          <Label for="userpassword">Нууц үг</Label>
                                          <AvInput type="password" placeholder="Нууц үг оруулах" name="password" id="password" required onChange={e => setPassword(e.target.value)} />
                                          <AvFeedback>Нууц үг оруулна уу !</AvFeedback>
                                       </AvGroup>

                                       <div className="mt-3">{errorMessage != "" ? <p className="text-danger">{errorMessage}</p> : null}</div>

                                       {/* <div className="custom-control custom-checkbox">
														<Input
															type="checkbox"
															className="custom-control-input"
															id="auth-remember-check"
															onChange={() => setRememberMe(!rememberMe)}
														/>
														<label
															className="custom-control-label"
															htmlFor="auth-remember-check"
														>
															Нэвтрэх нэр сануулах
														</label>
													</div> */}

                                       <div className="mt-3">
                                          <button className="btn btn-primary btn-block waves-effect waves-light" type="submit">
                                             Нэвтрэх
                                          </button>
                                       </div>
                                    </AvForm>
                                    {/* <div className="mt-5 text-center">
													<p>
														Don't have an account ?{" "}
														<Link
															to="page-register-2"
															className="font-weight-medium text-primary"
														>
															{" "}
															Signup now{" "}
														</Link>{" "}
													</p>
												</div> */}
                                 </div>
                              </div>

                              <div className="mt-4 mt-md-5 text-center">
                                 <p className="mb-0">
                                    {new Date().getFullYear()} Удирдлагын вэб <i className="mdi mdi-book text-danger"></i> by <a href="https://www.facebook.com/aidiversesolutions">Diverse Solutions LLC</a>
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Col>
               </Row>
            </Container>
         </div>
      </React.Fragment>
   )
}
export default withRouter(Login)
