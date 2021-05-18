import React, { useState, useEffect } from "react"
import { MDBDataTable } from "mdbreact"
import AddPodcast from "./AddPodcast"
import { Link } from "react-router-dom"
import {
  Row,
  Col,
  CardBody,
  CardTitle,
  Card,
  Label,
  Input,
  FormGroup,
} from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import axios from "axios"
import { conformsTo, update } from "lodash"

const columns = [
  {
    label: "Подкастын нэр",
    field: "pod_name",
    width: 150,
    attributes: {
      "aria-controls": "DataTable",
      "aria-label": "Name",
    },
  },
  {
    label: "Дугаар",
    field: "episode_number",
    width: 50,
    sort: "disabled",
  },
  {
    label: "Хандалт",
    field: "listen_count",
    sort: "disabled",
    width: 50,
  },
  // {
  //   label: "Төлөв",
  //   field: "state",
  //   sort: "disabled",
  //   width: 50,
  // },
  {
    label: "Үйлдэл",
    field: "edit",
    sort: "disabled",
    width: 20,
  },
]

const List = props => {
  const [latestEpisodeNumber, setLatestEpisodeNumber] = useState(0)
  const [data, set_data] = useState(props.podcasts)

  const [editEpisodeModal, setEditPodcastModal] = useState(false)
  const [confirm_edit, set_confirm_edit] = useState(false)
  const [confirm_delete, set_confirm_delete] = useState(false)
  const [coverImage, setCoverImage] = useState("")
  const [delete_podcast_id, set_delete_podcast_id] = useState(null)
  const [success_dialog, setsuccess_dialog] = useState(false)
  const [loading_dialog, setloading_dialog] = useState(false)
  const [error_dialog, seterror_dialog] = useState(false)

  // update, delete hiih state uud
  const [podcast_pic, set_podcast_pic] = useState(null)
  const [edit_podcast_name, set_edit_podcast_name] = useState("")
  const [edit_podcast_desc, set_edit_podcast_desc] = useState("")
  const [edit_podcast_file, set_edit_podcast_file] = useState("")

  // axios oor huselt ywuulj update hiih
  const updatePodcast = async podcast_id => {
    const updateForm = new FormData()
    updateForm.append("podcast_name", edit_podcast_name)
    updateForm.append("podcast_desc", edit_podcast_desc)
    // updateForm.append("podcast_file_name", edit_podcast_file)
    // updateForm.append("podcast_profile_pic", podcast_pic)

    const config = {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
    }

    await axios({
      url: `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-episodes/${podcast_id}`,
      method: "PUT",
      config,
      data: {
        episode_description: edit_podcast_desc,
        episode_name: edit_podcast_name,
      },
    })
      .then(async res => {
        setloading_dialog(false)

        setsuccess_dialog(true)

        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
      .catch(e => {
        setloading_dialog(false)
        seterror_dialog(true)
      })
  }

  // axios oor huselt ywuulj delete hiih
  const deletePodcast = async id => {
    const url = `${process.env.REACT_APP_EXPRESS_BASE_URL}/podcast/${id}`
    await axios
      .delete(url)
      .then(async res => {
        setloading_dialog(false)
        setsuccess_dialog(true)
        setTimeout(() => {
          window.location.reload()
        }, 1500)
        set_confirm_delete(false)
      })
      .catch(e => {
        setloading_dialog(false)
        seterror_dialog(true)
        set_confirm_delete(false)
      })
  }

  // zurag oorchloh
  const imageHandler = e => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setCoverImage(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
    set_podcast_pic(e.target.files[0])
  }

  // table der nemj edit button, tolowiig haruulah
  const initData = data => {
    let tempInitialData = data.map(d => {
      if (d.episode_number > latestEpisodeNumber) {
        setLatestEpisodeNumber(d.episode_number)
      }
      return {
        pod_name: d.podcast_name,
        podcast_state: d.podcast_state,
        episode_number: d.episode_number,
        listen_count: d.listen_count,
        edit: (
          <>
            <Link to="#" className="d-flex justify-content-around">
              <i
                onClick={() => {
                  setEditPodcastModal(true)
                  set_edit_podcast_name(d.podcast_name)
                  set_edit_podcast_desc(d.podcast_desc)
                  set_delete_podcast_id(d.id)
                }}
                className="bx bxs-edit text-primary font-size-20"
                id="edittooltip"
              />
              <i
                onClick={() => {
                  set_delete_podcast_id(d.id)
                  set_confirm_delete(true)
                }}
                className="bx bxs-trash text-danger font-size-20"
              />
            </Link>
          </>
        ),
        state: (
          <>
            {d.podcast_state ? (
              <p className="text-muted mb-0">
                <i className="mdi mdi-circle text-success align-middle mr-1" />
                Идэвхитэй
              </p>
            ) : (
              <p className="text-muted mb-0">
                <i className="mdi mdi-circle text-danger align-middle mr-1" />
                Идэвхгүй
              </p>
            )}
          </>
        ),
      }
    })
    set_data(tempInitialData)
  }

  const datatable = { columns, rows: data }

  useEffect(() => {
    initData(data)
  }, [])

  return (
    <React.Fragment>
      <Row>
        {editEpisodeModal ? (
          <SweetAlert
            showCancel
            title="Ерөнхий мэдээлэл"
            cancelBtnBsStyle="danger"
            confirmBtnText="Хадгалах"
            cancelBtnText="Цуцлах"
            style={{
              padding: "2em",
              borderRadius: "20px",
            }}
            onConfirm={() => {
              setEditPodcastModal(false)
              set_confirm_edit(true)
            }}
            onCancel={() => {
              setEditPodcastModal(false)
            }}
          >
            <Row>
              <Col xs="12" className="mb-3 mt-3">
                <Row>
                  <Col lg={2} className="m-auto">
                    <Label className="m-auto" for="kyclastname-input">
                      Нэр
                    </Label>
                  </Col>
                  <Col lg={10}>
                    <Input
                      type="text"
                      value={edit_podcast_name}
                      onChange={event => {
                        set_edit_podcast_name(event.target.value)
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg="12">
                <FormGroup>
                  <Label className="text-left w-100" htmlFor="productdesc">
                    Тайлбар
                  </Label>
                  <textarea
                    className="form-control"
                    id="productdesc"
                    rows="4"
                    value={edit_podcast_desc}
                    onChange={event => {
                      set_edit_podcast_desc(event.target.value)
                    }}
                  />
                </FormGroup>
              </Col>
              {/* <Col lg={5}>
                <Label
                  htmlFor="input"
                  className="image-upload d-flex justify-content-center"
                >
                  Зураг
                  <i className="bx bx-image-add font-size-20 ml-2"></i>
                </Label>
                <Row>
                  <img
                    className="rounded"
                    alt="Skote"
                    width="150"
                    src={coverImage}
                    //   onClick={() => {}}
                  />
                </Row>
                <input
                  type="file"
                  id="input"
                  accept="image/*"
                  className="invisible"
                  onChange={imageHandler}
                />
              </Col>
              <Col lg={12}>
                <div class="custom-file mt-2 mb-3">
                  <label
                    class="custom-file-label"
                    for="customFile"
                    value={data.podcast_file_url}
                    onChange={ev => {
                      set_edit_podcast_file(ev.target.value)
                    }}
                  >
                    {edit_podcast_file.length > 35 ? (
                      <p className="font-size-13 text-left">
                        {edit_podcast_file.slice(0, 30)}
                        {"..."}
                        {edit_podcast_file.slice(
                          edit_podcast_file.length - 3,
                          edit_podcast_file.length
                        )}
                      </p>
                    ) : (
                      <p className="font-size-13 text-left">
                        {edit_podcast_file}
                      </p>
                    )}
                  </label>
                  <input
                    type="file"
                    class="custom-file-input"
                    accept=".mp3"
                    id="customFile"
                  />
                </div>
              </Col> */}
            </Row>
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
        {confirm_edit ? (
          <SweetAlert
            title="Та итгэлтэй байна уу ?"
            warning
            showCancel
            confirmBtnText="Тийм"
            cancelBtnText="Болих"
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            onConfirm={() => {
              set_confirm_edit(false)
              setloading_dialog(true)
              setEditPodcastModal(false)
              updatePodcast(delete_podcast_id)
            }}
            onCancel={() => {
              set_confirm_edit(false)
              setEditPodcastModal(true)
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
        {confirm_delete ? (
          <SweetAlert
            title="Подкастын дугаарыг устгах гэж байна !"
            warning
            showCancel
            confirmBtnText="Тийм"
            cancelBtnText="Болих"
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            onConfirm={() => {
              setloading_dialog(true)
              deletePodcast(delete_podcast_id)
            }}
            onCancel={() => {
              set_confirm_delete(false)
            }}
          ></SweetAlert>
        ) : null}
        <Col xl={12}></Col>
        <Col xl="12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <CardTitle>Жагсаалт</CardTitle>
                <CardTitle className="text-right">
                  <AddPodcast latestEpisodeNumber={latestEpisodeNumber} />
                </CardTitle>
              </div>
              <MDBDataTable
                proSelect
                responsive
                striped
                bordered
                data={datatable}
                noBottomColumns
                noRecordsFoundLabel={"Подкастын дугаар байхгүй"}
                infoLabel={["", "-ээс", "дахь подкаст. Нийт", ""]}
                entries={5}
                entriesOptions={[5, 10, 20]}
                paginationLabel={["Өмнөх", "Дараах"]}
                searchingLabel={"Хайх"}
                searching
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default List
