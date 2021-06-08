import axios from "axios"
import React, { useState, useContext } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { Link } from "react-router-dom"
import { Card, CardBody, Button, Label, Input, Row, Col } from "reactstrap"

import { useLiveChannelStates } from "../../contexts/LiveChannelContext"
import { ResultPopUp } from "../../contexts/CheckActionsContext"

const LeftBar = () => {
   const { live_channels, set_live_channels } = useLiveChannelStates()
   const { edit_live_channel, set_edit_live_channel } = useLiveChannelStates()

   const [state, set_state] = useContext(ResultPopUp)

   const [add_live_channel, set_add_live_channel] = useState(false)
   const [confirm_add, set_confirm_add] = useState(false)

   const [create_live_name, set_create_live_name] = useState("")
   const [create_live_desc, set_create_live_desc] = useState("")

   // create new live channel
   const createLive = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }
      set_state({ loading: false })
      await axios
         .post(
            `${process.env.REACT_APP_STRAPI_BASE_URL}/radio-channels/`,
            {
               name: create_live_name,
               description: create_live_desc,
            },
            config
         )
         .then(res => {
            set_state({ success: true })
            setTimeout(() => {
               window.location.reload()
            }, 2000)
         })
         .catch(err => {
            set_state({ error: true })
         })
   }

   return (
      <React.Fragment>
         <Card className="p-0 m-0">
            <CardBody>
               <div className="d-flex flex-column">
                  <div className="mb-4">
                     <div className="mb-3">
                        <Button className="btn btn-light btn-block" color="#eff2f7" onClick={() => set_add_live_channel(true)}>
                           <i className="mdi mdi-plus mr-1"></i>Лайв үүсгэх
                        </Button>
                     </div>
                     <ul className="list-unstyled categories-list">
                        {live_channels
                           ? live_channels.map((channel, index) => (
                                <li key={index}>
                                   <div className="custom-accordion mb-2">
                                      <Link
                                         className="text-body font-weight-medium py-1 d-flex align-items-center"
                                         onClick={() => {
                                            set_edit_live_channel(channel.id)
                                         }}
                                         to="#"
                                      >
                                         <i className="fas fa-tv font-size-16 mr-2" style={{ color: channel.state ? "red" : "#000" }}></i>
                                         {channel.name}
                                      </Link>
                                   </div>
                                </li>
                             ))
                           : null}
                     </ul>
                  </div>
               </div>
            </CardBody>
         </Card>
         {add_live_channel ? (
            <SweetAlert
               showCancel
               title="Лайв суваг нэмэх"
               cancelBtnBsStyle="primary"
               confirmBtnBsStyle="success"
               confirmBtnText="Нэмэх"
               cancelBtnText="Цуцлах"
               onConfirm={() => {
                  set_add_live_channel(false)
                  set_confirm_add(true)
               }}
               onCancel={() => {
                  set_add_live_channel(false)
               }}
            >
               <Row className="my-4">
                  <Col lg={6}>
                     <Label className="w-100 text-left">Лайв нэр</Label>
                     <Input
                        type="text"
                        onChange={e => {
                           set_create_live_name(e.target.value)
                        }}
                     />
                  </Col>
                  <Col lg={6}>
                     <Label className="w-100 text-left">Тайлбар</Label>
                     <Input
                        type="textarea"
                        onChange={e => {
                           set_create_live_desc(e.target.value)
                        }}
                     />
                  </Col>
               </Row>
            </SweetAlert>
         ) : null}
         {confirm_add ? (
            <SweetAlert
               title="Шинэ лайв суваг үүсгэх гэж байна ?"
               info
               showCancel
               confirmBtnText="Тийм"
               cancelBtnText="Болих"
               confirmBtnBsStyle="success"
               cancelBtnBsStyle="danger"
               onConfirm={() => {
                  createLive()
                  set_state({ loading: true })
                  set_confirm_add(false)
               }}
               onCancel={() => {
                  set_confirm_add(false)
               }}
            ></SweetAlert>
         ) : null}
      </React.Fragment>
   )
}

export default LeftBar
