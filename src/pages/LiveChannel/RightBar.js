import React, { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardBody, Button, Label, Input } from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import Switch from "react-switch"
import { useLiveChannelStates } from "../../contexts/LiveChannelContext"

const RighBar = () => {
  const {
    selectedCard,
    setSelectedCard,
    edit_live_channel,
    set_edit_live_channel,
  } = useLiveChannelStates()

  const [confirm_edit, set_confirm_edit] = useState(false)
  const [confirm_delete, set_confirm_delete] = useState(false)
  const [success_dlg, set_success_dlg] = useState(false)
  const [error_dialog, set_error_dialog] = useState(false)
  const [loading_dialog, set_loading_dialog] = useState(false)

  // edit hiih state
  const [edit_live_name, set_edit_live_name] = useState("")
  const [edit_live_desc, set_edit_live_desc] = useState("")
  const [edit_live_state, set_edit_live_state] = useState(false)

  const editLiveInfo = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
    }
    await axios
      .put(
        `${process.env.REACT_APP_STRAPI_BASE_URL}/radio-channels/${edit_live_channel}`,
        {
          name: edit_live_name,
          description: edit_live_desc,
          is_active: edit_live_state,
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

  // delete live channel
  const deleteLive = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
    }

    await axios
      .delete(
        `${process.env.REACT_APP_STRAPI_BASE_URL}/radio-channels/${edit_live_channel}`,
        config
      )
      .then(async res => {
        set_loading_dialog(false)
        set_success_dlg(true)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(res => {
        set_loading_dialog(false)
        set_error_dialog(true)
      })
  }

  // live iin tolow solih
  const handleChange = checked => {
    set_edit_live_state(checked)
  }

  useEffect(() => {
    if (edit_live_channel != null) {
      let tempCard = selectedCard.find(card => card.id == edit_live_channel)
      set_edit_live_state(tempCard.is_active)
      set_edit_live_name(tempCard.name)
      set_edit_live_desc(tempCard.description)
    }
  }, [edit_live_channel])

  return (
    <React.Fragment>
      {edit_live_channel != null && (
        <>
          <Card>
            <CardBody>
              <h4 className="mb-3">
                <strong>Засварлах</strong>
              </h4>
              <Label>Нэр</Label>
              <Input
                className="mb-3"
                type="text"
                value={edit_live_name}
                onChange={e => set_edit_live_name(e.target.value)}
              />
              <Label>Тайлбар</Label>
              <Input
                type="textarea"
                style={{
                  minHeight: "100px",
                }}
                value={edit_live_desc}
                onChange={e => {
                  set_edit_live_desc(e.target.value)
                }}
              />
              <div className="d-flex justify-content-between align-items-center my-3">
                <Label className="my-auto">Төлөв</Label>
                <label className="d-flex w-50 my-auto justify-content-around">
                  <Switch onChange={handleChange} checked={edit_live_state} />
                </label>
              </div>
              <div className="d-flex justify-content-between">
                <Button
                  className="btn btn-success text-right"
                  onClick={() => {
                    set_confirm_edit(true)
                  }}
                >
                  Хадгалах
                </Button>

                <Button
                  className="btn btn-danger text-right"
                  onClick={() => {
                    set_confirm_delete(true)
                  }}
                >
                  Устгах
                </Button>
              </div>
            </CardBody>
          </Card>
        </>
      )}
      {confirm_delete ? (
        <SweetAlert
          title="Лайв сувгыг устгах ?"
          info
          showCancel
          confirmBtnText="Тийм!"
          cancelBtnText="Болих"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            deleteLive()
            set_loading_dialog(true)
            set_confirm_delete(false)
          }}
          onCancel={() => {
            set_confirm_delete(false)
          }}
        ></SweetAlert>
      ) : null}
      {confirm_edit ? (
        <SweetAlert
          title="Лайв сувагт өөрчлөлт хийх гэж байна ?"
          warning
          showCancel
          confirmBtnText="Тийм"
          cancelBtnText="Болих"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            // setSelectedCard(edit_live_name);
            editLiveInfo()
            set_loading_dialog(true)
            set_confirm_edit(false)
          }}
          onCancel={() => {
            set_confirm_edit(false)
          }}
        ></SweetAlert>
      ) : null}
      {success_dlg ? (
        <SweetAlert
          success
          title="Амжилттай"
          timeout={1500}
          style={{
            position: "absolute",
            top: "center",
            right: "center",
          }}
          showCloseButton={false}
          showConfirm={false}
          onConfirm={() => {
            set_success_dlg(false)
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
            // createPodcast()
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

export default RighBar
