import React, { useState, useEffect, useContext } from "react"
import { Card, CardBody, CardTitle, Col, Container, Input, Label, Row, Table } from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"

//Import Images
import profile1 from "../../assets/images/profile-img.png"
import PodcastAnalysis from "./PodcastAnalysis.js"
import List from "./List"
import axios from "axios"
import { ResultPopUp } from "../../contexts/CheckActionsContext"

const PodcastDetail = props => {
   const [state, set_state] = useContext(ResultPopUp)

   const [data, set_data] = useState(null)

   const [edit_detail, set_edit_detail] = useState(false)
   const [confirm_edit, set_confirm_edit] = useState(false)

   // update hiih state
   const [edit_podcast_channel, set_edit_podcast_channel] = useState("")
   const [edit_podcast_desc, set_edit_podcast_desc] = useState("")

   // update using formdata
   const updatePodcastInfo = async () => {
      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-channels/${props.channel.id}`,
         method: "PUT",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
         data: {
            name: edit_podcast_channel,
            description: edit_podcast_desc,
         },
      })
         .then(async res => {
            set_state({ loading: false })
            set_state({ success: true })
            setTimeout(() => {
               window.location.reload()
            }, 2000)
         })
         .catch(err => {
            set_state({ loading: false })
            set_state({ error: true })
         })
   }

   useEffect(() => {
      set_data(props.channel)
   }, [props])

   return (
      <React.Fragment>
         <Container fluid>
            {data != null ? (
               <Row>
                  <Col xl="4">
                     <Card className="overflow-hidden">
                        <div className="bg-soft-primary">
                           <Row>
                              <Col xs="12">
                                 <div className="text-primary p-3">
                                    <h5 className="text-primary">Тавтай морил</h5>
                                    <p>Мэдээлэл харах хуудас</p>
                                 </div>
                              </Col>
                              <Col xs="5" className="align-self-end">
                                 <img src={profile1} alt="" className="img-fluid" />
                              </Col>
                           </Row>
                        </div>
                        <CardBody className="pt-0">
                           <Row>
                              <Col sm="4">
                                 <div className="avatar-md profile-user-wid mb-4">
                                    <img style={{ width: "100%", height: "100%" }} src={data.channel_cover_pic} alt="" className="img-thumbnail rounded-circle" />
                                 </div>
                                 <p>
                                    <strong>{data.channel_name}</strong>
                                 </p>
                              </Col>

                              <Col sm={8}>
                                 <div className="pt-4">
                                    <Row>
                                       <Col xs="12" className="text-right">
                                          <p className="text-dark mb-0 font-size-15">Нийт подкастын тоо</p>
                                       </Col>
                                       <Col xs={12} className="text-right mt-2">
                                          <strong className="py-1 px-3 font-size-15">{data.user_podcasts.length}</strong>
                                       </Col>
                                    </Row>
                                 </div>
                              </Col>
                           </Row>
                        </CardBody>
                     </Card>

                     <Card>
                        <CardBody>
                           <CardTitle className="d-flex justify-content-between">
                              <p>Сувгийн дэлгэрэнгүй</p>
                              <i
                                 className="bx bx-edit font-size-20 text-primary ml-2"
                                 style={{ cursor: "pointer" }}
                                 onClick={() => {
                                    set_edit_podcast_channel(data.channel_name)
                                    set_edit_podcast_desc(data.channel_description)
                                    set_edit_detail(true)
                                 }}
                              />
                           </CardTitle>
                           <div className="table-responsive">
                              <Table className="table-nowrap mb-0">
                                 <tbody>
                                    <tr>
                                       <th scope="row">Подкаст суваг : {data.channel_name}</th>
                                    </tr>
                                    <tr>
                                       <th scope="row">Тайлбар : {data.channel_description}</th>
                                    </tr>
                                    <tr>
                                       <th scope="row">Нэмэгдсэн огноо: {new Date(data.channel_created_at).toLocaleDateString()}</th>
                                    </tr>
                                    <tr>
                                       <th scope="row">Сүүлд шинэчлэлт хийсэн : {new Date(data.channel_updated_at).toLocaleDateString()}</th>
                                    </tr>
                                 </tbody>
                              </Table>
                           </div>
                        </CardBody>
                        <CardBody>
                           <CardTitle className="mb-4">Хэрэглэгчийн дэлгэрэнгүй</CardTitle>
                           <div className="table-responsive">
                              <Table className="table-nowrap mb-0">
                                 <tbody>
                                    <tr>
                                       <th scope="row">Хэрэглэгчийн нэр : {data.user_fullname}</th>
                                    </tr>
                                 </tbody>
                              </Table>
                           </div>
                        </CardBody>
                     </Card>
                  </Col>
                  <Col xl={8}>
                     <Col xl={12}>
                        <PodcastAnalysis data={data.user_podcasts} />
                     </Col>
                     <Col xl="12">
                        <List set_data={set_data} data={data} podcasts={props.channel.user_podcasts} />
                     </Col>
                  </Col>
               </Row>
            ) : null}
            {edit_detail ? (
               <SweetAlert
                  showCancel
                  title="Ерөнхий мэдээлэл"
                  cancelBtnBsStyle="danger"
                  confirmBtnText="Хадгалах"
                  cancelBtnText="Болих"
                  style={{
                     padding: "2em",
                     borderRadius: "20px",
                  }}
                  onConfirm={() => {
                     set_edit_detail(false)
                     set_confirm_edit(true)
                  }}
                  onCancel={() => {
                     set_edit_detail(false)
                  }}
               >
                  <Row>
                     <Card>
                        <CardTitle className="mt-3 pl-2 text-left font-size-18 border-bottom border-dark">Подкаст мэдээлэл</CardTitle>
                        <Col xl={12}>
                           <Row>
                              <Col lg={6} className="py-3">
                                 <Label className="w-100 text-left">Подкаст суваг</Label>
                                 <Input
                                    type="text"
                                    value={edit_podcast_channel}
                                    onChange={e => {
                                       set_edit_podcast_channel(e.target.value)
                                    }}
                                 />
                              </Col>
                              <Col lg={6} className="py-3">
                                 <Label className="w-100 text-left">Тайлбар</Label>
                                 <textarea
                                    className="form-control"
                                    id="productdesc"
                                    rows="5"
                                    value={edit_podcast_desc}
                                    onChange={e => {
                                       set_edit_podcast_desc(e.target.value)
                                    }}
                                 />
                              </Col>
                           </Row>
                        </Col>
                     </Card>
                  </Row>
               </SweetAlert>
            ) : null}

            {confirm_edit ? (
               <SweetAlert
                  title="Та итгэлтэй байна уу ?"
                  warning
                  showCancel
                  confirmButtonText="Тийм!"
                  cancelBtnText="Болих"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_confirm_edit(false)
                     set_state({ loading: true })
                     updatePodcastInfo()
                  }}
                  onCancel={() => {
                     set_confirm_edit(false)
                  }}
               ></SweetAlert>
            ) : null}
         </Container>
      </React.Fragment>
   )
}

export default PodcastDetail
