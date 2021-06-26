import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import { Card, Col, Container, Row, CardBody, CardFooter, FormGroup, Label, Modal, Input } from "reactstrap"
import { map } from "lodash"
import MetaTags from "react-meta-tags"
import { Alert } from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import CardContact from "./card-contact"
import axios from "axios"
import { ResultPopUp } from "../../contexts/CheckActionsContext"

const userTypes = {
   Админ: 1,
   Менежер: 2,
   "Хүргэлтийн ажилтан": 3,
   "Ном нийлүүлэгч": 5,
   "Подкаст нийлүүлэгч": 4,
}

const ManageAdmins = () => {
   const [state, set_state] = useContext(ResultPopUp)

   const [isNetworkError, SetIsNetworkError] = useState(false)
   const [isNetworkLoading, SetIsNetworkLoading] = useState(true)
   const [usersList, setUsersList] = useState([])
   const [addAdminStep1, setAddAdminStep1] = useState(false)
   const [profile_picture_create, set_profile_picture_create] = useState(null)
   const [is_blocked, set_is_blocked] = useState(null)

   const [username, setUsername] = useState("")
   const [email, setEmail] = useState("")
   const [fullname, setFullname] = useState("")
   const [phone, setPhone] = useState("")
   const [gender, setGender] = useState("")
   const [password, setPassword] = useState("")
   const [userType, setUserType] = useState(1)
   const [passwordAgain, setPasswordAgain] = useState("")
   const [add_admin_error_msg, set_add_admin_error_msg] = useState("")

   const initializeUsersList = data => {
      let usersTempList = data.map(user => {
         return {
            id: user.id,
            color: user.gender == "Male" ? "red" : "yellow",
            name: user.fullname,
            designation: `Утас: ${user.phone}`,
            roles: [
               {
                  name: user.user_role == 1 ? "Админ" : user.user_role == 2 ? "Менежер" : user.user_role == 3 ? "Хүргэгч" : user.user_role == 4 ? "Подкаст нийлүүлэгч" : user.user_role == 5 ? "Ном нийлүүлэгч" : "Бусад",
               },
               {
                  is_blocked: user.blocked ? "Блоклогдсон" : "",
               },
            ],
            img: user.profile_picture ? `${process.env.REACT_APP_STRAPI_BASE_URL}${user.profile_picture.url}` : null,
            allData: user,
            is_blocked: user.blocked,
         }
      })

      let tempReverseArray = []

      usersTempList.map(user => {
         tempReverseArray.unshift(user)
      })
      setUsersList([...tempReverseArray, ...usersList])
      return tempReverseArray
   }

   const createUser = async () => {
      set_state({ loading: false })

      const formData = new FormData()

      // Validate empty fields
      try {
         handleAddAdminErrors()
      } catch (error) {
         switch (error) {
            case "Null value":
               set_add_admin_error_msg("Өгөгдөл дутуу")
               break

            case "Passwords not equal":
               set_add_admin_error_msg("Нууц үг зөрүүтэй")
               break

            case "Password is weak":
               set_add_admin_error_msg("Нууц үгийн урт 8-с бага")
               break

            default:
               break
         }
         return
      }

      set_add_admin_error_msg("")

      formData.append("username", username)
      formData.append("password", password)
      formData.append("email", email)
      formData.append("emailof", email)
      formData.append("phone", phone)
      formData.append("gender", gender)
      formData.append("fullname", fullname)
      formData.append("user_role", userType)

      const config = {
         headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      // TODO fix email.missing
      await axios
         .post(
            `${process.env.REACT_APP_STRAPI_BASE_URL}/users`,
            // `${process.env.REACT_APP_EXPRESS_BASE_URL}/create-admin`,
            formData,
            config
         )
         .then(async res => {
            let tempResponse = res.data
            let imageData = new FormData()

            imageData.append("files", profile_picture_create, profile_picture_create.name)
            imageData.append("refId", res.data.id)
            imageData.append("ref", "user")
            imageData.append("field", "profile_picture")
            imageData.append("source", "users-permissions")

            await axios
               .post(`${process.env.REACT_APP_STRAPI_BASE_URL}/upload`, imageData, config)
               .then(res => {
                  tempResponse.profile_picture = res.data[0]
                  set_state({ success: true })
                  SetIsNetworkLoading(false)
                  setTimeout(() => {
                     window.location.reload()
                  }, 2000)
               })
               .catch(err => {
                  set_state({ error: true })
                  setAddAdminStep1(false)
                  // SetIsNetworkError(true)
               })
            initializeUsersList([tempResponse])
         })
         .catch(err => {
            set_state({ error: true })
            setAddAdminStep1(false)
            SetIsNetworkLoading(false)
         })
   }

   const fetchUsers = async () => {
      await axios({
         method: "GET",
         headers: {
            Authorization: `${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
         url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/all-admins-list`,
      })
         .then(res => {
            set_is_blocked(res.data.blocked)
            SetIsNetworkLoading(false)
            initializeUsersList(res.data)
         })
         .catch(err => {
            SetIsNetworkError(true)
            SetIsNetworkLoading(false)
         })
   }

   useEffect(() => {
      fetchUsers()
   }, [])

   return (
      <React.Fragment>
         <div className="page-content">
            <MetaTags>
               <title>Ажилчид</title>
            </MetaTags>
            <Container fluid>
               <Col xl="3" lg="4" sm="6" className="mb-2">
                  <Modal
                     size="lg"
                     isOpen={addAdminStep1}
                     toggle={() => {
                        setAddAdminStep1(!addAdminStep1)
                     }}
                     centered={true}
                  >
                     <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myLargeModalLabel">
                           Админ хэрэглэгч үүсгэх
                        </h5>
                        <button
                           onClick={() => {
                              setAddAdminStep1(false)
                           }}
                           type="button"
                           className="close"
                           data-dismiss="modal"
                           aria-label="Close"
                        >
                           <span aria-hidden="true">&times;</span>
                        </button>
                     </div>
                     <div className="modal-body">
                        <AvForm
                           className="needs-validation"
                           onSubmit={() => {
                              set_state({ loading: true })
                              createUser()
                           }}
                        >
                           <Row>
                              <Col md="6">
                                 <FormGroup className="select2-container">
                                    <Label>Хэрэглэгчийн төрөл</Label>
                                    <AvField type="select" name="userType" onChange={e => handleStepChange(e)}>
                                       <option>Админ</option>
                                       <option>Менежер</option>
                                       <option>Хүргэлтийн ажилтан</option>
                                       <option>Ном нийлүүлэгч</option>
                                       <option>Подкаст нийлүүлэгч</option>
                                    </AvField>
                                 </FormGroup>
                              </Col>
                              <Col md="6">
                                 <FormGroup>
                                    <Label htmlFor="validationCustom01">Нэвтрэх нэр</Label>
                                    <AvField name="username" placeholder="Нэвтрэх нэр" type="text" errorMessage="Нэвтрэх нэр оруул" className="form-control" validate={{ required: { value: true } }} id="validationCustom01" onChange={e => handleStepChange(e)} value={username} />
                                 </FormGroup>
                              </Col>
                           </Row>
                           <Row>
                              <Col md="4">
                                 <FormGroup>
                                    <Label htmlFor="validationCustom02">Э-майл хаяг</Label>
                                    <AvField name="email" placeholder="Э-майл хаяг" type="email" errorMessage="Э-майл хаяг оруул" className="form-control" validate={{ required: { value: true } }} id="validationCustom02" value={email} onChange={e => handleStepChange(e)} />
                                 </FormGroup>
                              </Col>
                              <Col md="4">
                                 <FormGroup>
                                    <Label htmlFor="validationCustom04">Бүтэн нэр</Label>
                                    <AvField name="fullname" placeholder="Бүтэн нэр" type="text" errorMessage="Бүтэн нэр" className="form-control" validate={{ required: { value: true } }} id="validationCustom04" value={fullname} onChange={e => handleStepChange(e)} />
                                 </FormGroup>
                              </Col>
                              <Col md="4">
                                 <FormGroup>
                                    <Label htmlFor="validationCustom04">Утасны дугаар</Label>
                                    <AvField name="phone" placeholder=" Утасны дугаар" type="text" errorMessage="Бүтэн нэр" className="form-control" validate={{ required: { value: true } }} id="validationCustom04" value={phone} onChange={e => handleStepChange(e)} />
                                 </FormGroup>
                              </Col>
                           </Row>
                           <Row>
                              <Col lg="12">
                                 <FormGroup>
                                    <Label className="d-block mb-3">Хүйс :</Label>
                                    <div className="custom-control custom-radio custom-control-inline">
                                       <Input value="Male" type="radio" id="customRadioInline1" name="gender" className="custom-control-input" onChange={e => handleStepChange(e)} />
                                       <Label className="custom-control-label" htmlFor="customRadioInline1">
                                          Эрэгтэй
                                       </Label>
                                    </div>
                                    &nbsp;
                                    <div className="custom-control custom-radio custom-control-inline">
                                       <Input value="Female" type="radio" id="customRadioInline2" name="gender" className="custom-control-input" onChange={e => handleStepChange(e)} />
                                       <Label className="custom-control-label" htmlFor="customRadioInline2">
                                          Эмэгтэй
                                       </Label>
                                    </div>
                                 </FormGroup>{" "}
                              </Col>
                           </Row>
                           <Row>
                              <Col md="6">
                                 <FormGroup className="select2-container">
                                    <Label htmlFor="validationCustom01">Нууц үг</Label>
                                    <AvField type="password" name="password" placeholder="Нууц үг" type="text" errorMessage="Нууц үг оруул" className="form-control" validate={{ required: { value: true } }} id="validationCustom01" onChange={e => handleStepChange(e)} value={password} />
                                 </FormGroup>
                              </Col>
                              <Col md="6">
                                 <FormGroup>
                                    <Label htmlFor="validationCustom01">Нууц үг давтах</Label>
                                    <AvField
                                       type="password"
                                       name="password again"
                                       placeholder="Нууц үг давтах"
                                       type="text"
                                       errorMessage="Давтах нууц үг оруул"
                                       className="form-control"
                                       validate={{ required: { value: true } }}
                                       id="validationCustom01"
                                       onChange={e => handleStepChange(e)}
                                       value={passwordAgain}
                                    />
                                 </FormGroup>
                              </Col>
                           </Row>
                           <Row>
                              <Col lg="12">
                                 <FormGroup>
                                    <Label for="adminProfilePic" class="btn">
                                       Нүүр зураг
                                    </Label>
                                    <Input
                                       required
                                       id="adminProfilePic"
                                       // style={{ visibility: "hidden" }}
                                       accept="image/*"
                                       type="file"
                                       name="profile_picture"
                                       onChange={e => handleStepChange(e)}
                                    />
                                 </FormGroup>
                              </Col>
                              <Col lg="12">
                                 <span style={{ color: "#f46a6a" }}>{add_admin_error_msg}</span>
                              </Col>
                           </Row>

                           <div className="modal-footer">
                              <button type="submit" className="btn btn-primary">
                                 Дуусгах
                              </button>
                              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setAddAdminStep1(false)}>
                                 Болих
                              </button>
                           </div>
                        </AvForm>
                     </div>
                  </Modal>
               </Col>
               {/* Render Breadcrumbs */}
               <Breadcrumbs title="Админы удидлага" breadcrumbItem="Ажилчдын жагсаалт" />
               {isNetworkError ? (
                  <Alert color="danger" role="alert">
                     Сүлжээ уналаа ! Дахин ачааллна уу ?
                  </Alert>
               ) : (
                  <>
                     {!isNetworkLoading ? (
                        <>
                           <Row>
                              <Col xl="3" sm="6">
                                 <Card className="text-center" style={{ background: "#ccf0e3" }}>
                                    <CardBody>
                                       <i
                                          className="bx bx-plus"
                                          style={{ fontSize: "157px", color: "#34c38f" }}
                                          onClick={() => {
                                             setAddAdminStep1(true)
                                          }}
                                       />
                                    </CardBody>
                                    <CardFooter className="bg-transparent border-top">
                                       <div className="contact-links d-flex font-size-20">
                                          <div className="flex-fill" style={{ color: "#34c38f" }}>
                                             Ажилтан нэмэх
                                          </div>
                                       </div>
                                    </CardFooter>
                                 </Card>
                              </Col>
                              {map(usersList, (user, key) => (
                                 <CardContact user={user} key={"_user_" + key} initializeUsersList={initializeUsersList} />
                              ))}
                           </Row>
                        </>
                     ) : (
                        <Row>
                           <Col xs="12">
                              <div className="text-center my-3">
                                 <Link to="#" className="text-success">
                                    <i className="bx bx-hourglass bx-spin mr-2" />
                                    Ачааллаж байна
                                 </Link>
                              </div>
                           </Col>
                        </Row>
                     )}
                  </>
               )}
            </Container>
         </div>
      </React.Fragment>
   )

   function handleStepChange(e) {
      switch (e.target.name) {
         case "username":
            // alert("username");
            setUsername(e.target.value)
            break
         case "profile_picture":
            set_profile_picture_create(e.target.files[0])
            break
         case "email":
            setEmail(e.target.value)
            break
         case "userType":
            setUserType(userTypes[e.target.value])
            break
         case "fullname":
            setFullname(e.target.value)
            break
         case "phone":
            setPhone(e.target.value)
            break
         case "gender":
            setGender(e.target.value)
            break
         case "password":
            setPassword(e.target.value)
            break
         case "password again":
            setPasswordAgain(e.target.value)
            break
      }
   }

   function handleAddAdminErrors() {
      if (username == "") throw "Null value"
      if (email == "") throw "Null value"
      if (phone == "") throw "Null value"
      if (gender == "") throw "Null value"
      if (fullname == "") throw "Null value"
      if (userType == "") throw "Null value"
      if (password == "") throw "Null value"
      if (passwordAgain == "") throw "Null value"
      if (profile_picture_create == null) throw "Null value"
      if (password != passwordAgain) throw "Passwords not equal"
      if (password.length < 9) throw "Password is weak"
   }
}

export default ManageAdmins
