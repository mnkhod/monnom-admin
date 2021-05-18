import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"

//Import Images
import profile1 from "../../assets/images/profile-img.png"
import PodcastAnalysis from "./PodcastAnalysis.js"
import List from "./List"
import axios from "axios"

const PodcastDetail = props => {
  const [data, set_data] = useState(null)

  const [edit_detail, set_edit_detail] = useState(false)
  const [confirm_edit, set_confirm_edit] = useState(false)
  const [delete_confirm_comment, set_delete_confirm_comment] = useState(false)
  const [success_dialog, setsuccess_dialog] = useState(false)
  const [error_dialog, seterror_dialog] = useState(false)
  const [loading_dialog, setloading_dialog] = useState(false)

  // update hiih state
  const [edit_podcast_channel, set_edit_podcast_channel] = useState("")
  const [edit_podcast_desc, set_edit_podcast_desc] = useState("")
  const [delete_channel_comment, set_delete_channel_comment] = useState(null)

  // update using formdata
  const updatePodcastInfo = async () => {
    await axios({
      url: `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-channels/${props.channel.id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
      data: {
        name: edit_podcast_channel,
        description: edit_podcast_desc,
      },
    })
      .then(async res => {
        setsuccess_dialog(true)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(err => {
        seterror_dialog(true)
      })
  }

  const deleteChannelComment = async () => {
    await axios
      .delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/`)
      .then(async res => {
        setloading_dialog(false)
        setsuccess_dialog(true)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(res => {
        setloading_dialog(false)
        seterror_dialog(true)
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
                        <img
                          style={{ width: "100%", height: "100%" }}
                          src={
                            process.env.REACT_APP_STRAPI_BASE_URL +
                            data.channel_cover_pic
                          }
                          alt=""
                          className="img-thumbnail rounded-circle"
                        />
                      </div>
                      <p>
                        <strong>{data.channel_name}</strong>
                      </p>
                    </Col>

                    <Col sm={8}>
                      <div className="pt-4">
                        <Row>
                          <Col xs="12" className="text-right">
                            <p className="text-dark mb-0 font-size-15">
                              Нийт подкастын тоо
                            </p>
                          </Col>
                          <Col xs={12} className="text-right mt-2">
                            <strong className="py-1 px-3 font-size-15">
                              {data.user_podcasts.length}
                            </strong>
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
                    <div>
                      <i
                        className="bx bx-comment-dots font-size-20 text-warning"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          set_delete_confirm_comment(true)
                        }}
                      />
                      <i
                        className="bx bx-edit font-size-20 text-primary ml-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          set_edit_podcast_channel(data.channel_name)
                          set_edit_podcast_desc(data.channel_description)
                          set_edit_detail(true)
                        }}
                      />
                    </div>
                  </CardTitle>
                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th scope="row">
                            Подкаст суваг : {data.channel_name}
                          </th>
                        </tr>
                        <tr>
                          <th scope="row">
                            Тайлбар : {data.channel_description}
                          </th>
                        </tr>
                        <tr>
                          <th scope="row">
                            Нэмэгдсэн огноо:{" "}
                            {new Date(
                              data.channel_created_at
                            ).toLocaleDateString()}
                          </th>
                        </tr>
                        <tr>
                          <th scope="row">
                            Сүүлд шинэчлэлт хийсэн :{" "}
                            {new Date(
                              data.channel_updated_at
                            ).toLocaleDateString()}
                          </th>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
                <CardBody>
                  <CardTitle className="mb-4">
                    Хэрэглэгчийн дэлгэрэнгүй
                  </CardTitle>
                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th scope="row">
                            Хэрэглэгчийн нэр : {data.user_fullname}
                          </th>
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
                <List
                  set_data={set_data}
                  data={data}
                  podcasts={props.channel.user_podcasts}
                />
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
                <CardTitle className="mt-3 pl-2 text-left font-size-18 border-bottom border-dark">
                  Подкаст мэдээлэл
                </CardTitle>
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
        {delete_confirm_comment ? (
          <SweetAlert
            showCancel
            title="Сэтгэгдэл"
            cancelBtnBsStyle="primary"
            confirmBtnBsStyle="danger"
            confirmBtnText="Устгах"
            cancelBtnText="Буцах"
            style={{
              padding: "2em",
              borderRadius: "20px",
            }}
            onConfirm={() => {
              deleteChannelComment()
              set_delete_confirm_comment(false)
              setloading_dialog(true)
            }}
            onCancel={() => {
              set_delete_confirm_comment(false)
            }}
          >
            <Row>
              <Card>
                <Col xl={12}>
                  <Label>{delete_channel_comment}</Label>
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
              // setsuccess_dlg(true)
              // setdynamic_title("Амжилттай")
              // setdynamic_description("Шинэчлэлт амжилттай хийгдлээ.")
              updatePodcastInfo()
            }}
            onCancel={() => {
              set_confirm_edit(false)
            }}
          ></SweetAlert>
        ) : null}
        {success_dialog ? (
          <SweetAlert
            title={"Амжилттай"}
            timeout={2000}
            style={{
              position: "absolute",
              top: "center",
              right: "center",
            }}
            showCloseButton={false}
            showConfirm={false}
            success
            onConfirm={() => {
              // createPodcast()
              setsuccess_dialog(false)
            }}
          >
            {"Үйлдэл амжилттай боллоо"}
          </SweetAlert>
        ) : null}
        {error_dialog ? (
          <SweetAlert
            title={"Амжилтгүй"}
            timeout={2000}
            style={{
              position: "absolute",
              top: "center",
              right: "center",
            }}
            showCloseButton={false}
            showConfirm={false}
            error
            onConfirm={() => {
              // createPodcast()
              seterror_dialog(false)
            }}
          >
            {"Үйлдэл амжилтгүй боллоо"}
          </SweetAlert>
        ) : null}
        {loading_dialog ? (
          <SweetAlert
            title="Түр хүлээнэ үү"
            info
            showCloseButton={false}
            showConfirm={false}
            success
          ></SweetAlert>
        ) : null}
      </Container>
    </React.Fragment>
  )
}

export default PodcastDetail
