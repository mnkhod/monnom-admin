import axios from "axios"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, CardFooter, Col, UncontrolledTooltip, Modal, Row } from "reactstrap"

const PodcastAlert = props => {
   const { user } = props
   const [user_desc_modal_center, set_user_desc_modal_center] = useState(false)
   const [user_update_modal_center, set_user_update_modal_center] = useState(false)
   const [edit_username, set_edit_username] = useState("")
   const [edit_password, set_edit_password] = useState("")
   const [edit_phone, set_edit_phone] = useState("")
   const [edit_email, set_edit_email] = useState("")

   const edit_form_elements = [
      {
         verbose: "Нэвтрэх нэр",
         name: "username",
      },
      {
         verbose: "Нууц үг",
         name: "password",
      },
      {
         verbose: "Утасны дугаар",
         name: "phone",
      },
      {
         verbose: "Э-Майл",
         name: "email",
      },
   ]

   const sendEditUserRequest = user_id => {
      let tempData = { id: user_id }
      if (edit_username != "") tempData = { ...tempData, username: edit_username }
      if (edit_password != "") tempData = { ...tempData, password: edit_password }
      if (edit_phone != "") tempData = { ...tempData, phone: edit_phone }
      if (edit_email != "") tempData = { ...tempData, email: edit_email }
      axios({
         method: "POST",
         url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/update-employee`,
         data: tempData,
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(res => {})
         .catch(err => {})
   }

   const handleFormChange = e => {
      switch (e.target.name) {
         case "username":
            set_edit_username(e.target.value)
            break
         case "password":
            set_edit_password(e.target.value)
            break
         case "phone":
            set_edit_phone(e.target.value)
            break
         case "email":
            set_edit_email(e.target.value)
            break
      }
   }

   function toggle_user_desc_modal() {
      set_user_desc_modal_center(!user_desc_modal_center)
      removeBodyCss()
   }

   function toggle_user_update_modal() {
      set_user_update_modal_center(!user_update_modal_center)
      removeBodyCss()
   }

   function removeBodyCss() {
      document.body.classList.add("no_padding")
   }

   return (
      <React.Fragment>
         <Col xl="3" sm="6">
            <Card className="text-center">
               <CardBody>
                  {!user.img ? (
                     <div className="avatar-sm mx-auto mb-4">
                        <span className={"avatar-title rounded-circle bg-soft-" + user.color + " text-" + user.color + " font-size-16"}>{user.name.charAt(0)}</span>
                     </div>
                  ) : (
                     <div className="mb-4">
                        <img className="rounded-circle avatar-sm" src={user.img} alt="" />
                     </div>
                  )}

                  <h5 className="font-size-15">
                     <Link to="#" className="text-dark">
                        {user.name}
                     </Link>
                  </h5>
                  <p className="text-muted">{user.designation}</p>

                  <div>
                     {user.roles.map((skill, key) => (
                        <Link to="#" className="badge badge-primary font-size-11 m-1" key={"_skill_" + key}>
                           {skill.name}
                        </Link>
                     ))}
                  </div>
               </CardBody>
               <CardFooter className="bg-transparent border-top">
                  <div className="contact-links d-flex font-size-20">
                     <div className="flex-fill">
                        <Link onClick={() => toggle_user_update_modal()} id={"message" + user.id}>
                           <i className="bx bx-edit" />
                           <UncontrolledTooltip placement="top" target={"message" + user.id}>
                              Засварлах
                           </UncontrolledTooltip>
                        </Link>
                     </div>
                     <div className="flex-fill">
                        <Link id={"project" + user.id} onClick={() => toggle_user_desc_modal()}>
                           <i className="bx bx-pie-chart-alt" />
                           <UncontrolledTooltip placement="top" target={"project" + user.id}>
                              Дэлгэрэнгүй
                           </UncontrolledTooltip>
                        </Link>
                     </div>
                     {/* <div className="flex-fill">
								<Link to="#" id={"profile" + user.id}>
									<i className="bx bx-user-circle" />
									<UncontrolledTooltip
										placement="top"
										target={"profile" + user.id}
									>
										Profile
									</UncontrolledTooltip>
								</Link>
							</div> */}
                  </div>
               </CardFooter>
            </Card>
         </Col>
         <Modal
            isOpen={user_desc_modal_center}
            toggle={() => {
               toggle_user_desc_modal()
            }}
            centered={true}
         >
            <div className="modal-header">
               <h5 className="modal-title mt-0">Ажилтны дэлгэрэнгүй</h5>
               <button
                  type="button"
                  onClick={() => {
                     set_user_desc_modal_center(false)
                  }}
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
               >
                  <span aria-hidden="true">&times;</span>
               </button>
            </div>
            <div className="modal-body">
               <Col xs={12}>
                  <img alt={user.name + " name"} src={process.env.REACT_APP_STRAPI_BASE_URL + user.allData.profile_picture.formats.thumbnail.url}></img>
               </Col>
            </div>
         </Modal>
         <Modal
            isOpen={user_update_modal_center}
            toggle={() => {
               toggle_user_update_modal()
            }}
         >
            <div className="modal-header">
               <h5 className="modal-title mt-0">
                  <b>Ажилтны мэдээлэл засах</b>
               </h5>
               <button
                  type="button"
                  onClick={() => {
                     set_user_update_modal_center(false)
                  }}
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
               >
                  <span aria-hidden="true">&times;</span>
               </button>
            </div>
            <div className="modal-body">
               <form>
                  <Col xs={12}>
                     {edit_form_elements.map(element => (
                        <>
                           <b>{element.verbose}</b>
                           <input
                              type="text"
                              className="form-control"
                              name={element.name}
                              onChange={e => {
                                 handleFormChange(e)
                              }}
                           />
                        </>
                     ))}

                     <Row>
                        <Col className="text-center text-md-right" style={{ marginTop: "15px" }}>
                           <button type="reset" onClick={() => sendEditUserRequest(user.id)} className="btn btn-success waves-effect btn-label waves-light">
                              <i className="bx bx-check-double label-icon"></i> Засах
                           </button>
                           <button onClick={() => set_user_update_modal_center(false)} style={{ marginLeft: "5px" }} className="btn btn-danger waves-effect btn-label waves-light">
                              <i className="bx bx-check-double label-icon"></i> Болих
                           </button>
                        </Col>
                     </Row>
                  </Col>
               </form>
            </div>
         </Modal>
      </React.Fragment>
   )
}

export default PodcastAlert
