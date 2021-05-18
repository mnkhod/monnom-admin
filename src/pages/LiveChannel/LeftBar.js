import axios from "axios"
import React, { useState } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Row,
  Col,
  Collapse,
} from "reactstrap"

import { useLiveChannelStates } from "../../contexts/LiveChannelContext"

const LeftBar = () => {
  const { live_channels, set_live_channels } = useLiveChannelStates()
  const { edit_live_channel, set_edit_live_channel } = useLiveChannelStates()

  const [isOpen, setIsOpen] = useState(false)

  const [add_live_channel, set_add_live_channel] = useState(false)
  const [confirm_add, set_confirm_add] = useState(false)
  const [success_dlg, set_success_dlg] = useState(false)
  const [error_dialog, set_error_dialog] = useState(false)
  const [loading_dialog, set_loading_dialog] = useState(false)

  const [create_live_name, set_create_live_name] = useState("")
  const [create_live_desc, set_create_live_desc] = useState("")

  // create new live channel
  const createLive = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
    }

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
        set_loading_dialog(false)
        set_success_dlg(true)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(err => {
        set_loading_dialog(false)
        set_error_dialog(true)
      })
  }

  return (
    <React.Fragment>
      <Card className="p-0 m-0">
        <CardBody>
          <div className="d-flex flex-column">
            <div className="mb-4">
              <div className="mb-3">
                <Button
                  className="btn btn-light btn-block"
                  color="#eff2f7"
                  onClick={() => set_add_live_channel(true)}
                >
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
                            <i
                              className="fas fa-tv font-size-16 mr-2"
                              style={{ color: channel.state ? "red" : "#000" }}
                            ></i>
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
            set_loading_dialog(true)
            set_confirm_add(false)
          }}
          onCancel={() => {
            set_confirm_add(false)
          }}
        ></SweetAlert>
      ) : null}
      {success_dlg ? (
        <SweetAlert
          title="Амжилттай"
          timeout={1500}
          style={{
            position: "absolute",
            top: "center",
            right: "center",
          }}
          showCloseButton={false}
          showConfirm={false}
          success
          onConfirm={() => {
            setsuccess_dlg(false)
          }}
        >
          Шинэчлэлт амжилттай хийгдлээ.
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
            set_error_dialog(false)
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
    </React.Fragment>
  )
}

export default LeftBar
