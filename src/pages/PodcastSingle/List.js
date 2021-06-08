import React, { useState, useEffect, useContext } from "react"
import { MDBDataTable } from "mdbreact"
import AddPodcast from "./AddPodcast"
import { Link } from "react-router-dom"
import { Row, Col, CardBody, CardTitle, Card, Label, Input, FormGroup } from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import axios from "axios"
import { ResultPopUp } from "../../contexts/CheckActionsContext"

const EditPodcast = ({ episode_id, setEditPodcastModal, editEpisodeModal }) => {
   // update, delete hiih state uud
   const [podcast_pic, set_podcast_pic] = useState(null)
   const [edit_podcast_name, set_edit_podcast_name] = useState("")
   const [edit_podcast_desc, set_edit_podcast_desc] = useState("")
   const [edit_podcast_file, set_edit_podcast_file] = useState("")
   const [coverImage, setCoverImage] = useState("")
   const [edit_send_file, set_edit_send_file] = useState(null)
   const [confirm_edit, set_confirm_edit] = useState(false)
   const [check_field, set_check_field] = useState("")
   const [difference_identifier, set_difference_identifier] = useState({
      title: false,
      desc: false,
      cover_pic: false,
      audio_file: false,
   })
   const [state, set_state] = useContext(ResultPopUp)

   // axios oor huselt ywuulj update hiih
   const updatePodcast = async () => {
      set_state({ loading: true })
      let successFlag = false

      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      if (difference_identifier.title || difference_identifier.desc) {
         await axios({
            url: `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-episodes/${episode_id}`,
            method: "PUT",
            config,
            data: {
               episode_description: edit_podcast_desc,
               episode_name: edit_podcast_name,
            },
         })
            .then(async res => {
               successFlag = true
            })
            .catch(e => {})
      }

      if (difference_identifier.cover_pic) {
         let coverPicData = new FormData()
         coverPicData.append("files", podcast_pic, podcast_pic.name)
         coverPicData.append("refId", episode_id)
         coverPicData.append("ref", "podcast-episode")
         coverPicData.append("field", "picture")

         await axios({
            url: `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-episodes/${episode_id}`,
            method: "PUT",
            config,
            data: {
               picture: null,
            },
         }).catch(e => {})

         await axios({
            url: `${process.env.REACT_APP_STRAPI_BASE_URL}/upload`,
            method: "POST",
            config,
            data: coverPicData,
         })
            .then(async res => {
               successFlag = true
            })
            .catch(e => {})
      }

      if (difference_identifier.audio_file) {
         let audioFormData = new FormData()
         audioFormData.append("files", edit_send_file, edit_send_file.name)
         audioFormData.append("refId", episode_id)
         audioFormData.append("ref", "podcast-episode")
         audioFormData.append("field", "audio_file_path")

         await axios({
            url: `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-episodes/${episode_id}`,
            method: "PUT",
            config,
            data: {
               audio_file_path: null,
            },
         }).catch(e => {})

         await axios({
            url: `${process.env.REACT_APP_STRAPI_BASE_URL}/upload`,
            method: "POST",
            config,
            data: audioFormData,
         })
            .then(async res => {
               successFlag = true
            })
            .catch(e => {})
      }
      if (successFlag) {
         set_state({ loading: false })
         set_state({ success: true })
         setTimeout(() => {
            window.location.reload()
         }, 1500)
      } else {
         set_state({ loading: false })
         set_state({ error: true })
      }
   }

   const fetchChannel = () => {
      axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-episodes/${episode_id}`,
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(res => {
            set_edit_podcast_name(res.data.episode_name)
            set_edit_podcast_desc(res.data.episode_description)
            set_edit_podcast_file(res.data.audio_file_path.name)
            setCoverImage(`${process.env.REACT_APP_STRAPI_BASE_URL}${res.data.picture.url}`)
            podcast_pic(`${process.env.REACT_APP_STRAPI_BASE_URL}${res.data.picture.url}`)
         })
         .catch(err => {})
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
      if (!difference_identifier.cover_pic) set_difference_identifier({ ...difference_identifier, cover_pic: true })
   }

   useEffect(() => {
      fetchChannel()
   }, [episode_id])

   return (
      <>
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
                  setEditPodcastModal(false)
                  updatePodcast()
               }}
               onCancel={() => {
                  set_confirm_edit(false)
                  setEditPodcastModal(true)
               }}
            ></SweetAlert>
         ) : null}

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
                  set_confirm_edit(true)
                  setEditPodcastModal(false)
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
                                 if (!difference_identifier.title)
                                    set_difference_identifier({
                                       ...difference_identifier,
                                       title: true,
                                    })
                                 set_edit_podcast_name(event.target.value)
                              }}
                           />
                        </Col>
                     </Row>
                  </Col>
                  <Col lg="7">
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
                              if (!difference_identifier.desc)
                                 set_difference_identifier({
                                    ...difference_identifier,
                                    desc: true,
                                 })
                              set_edit_podcast_desc(event.target.value)
                           }}
                        />
                     </FormGroup>
                  </Col>
                  <Col lg={5}>
                     <Label htmlFor="input" className="image-upload d-flex justify-content-center">
                        Зураг
                        <i className="bx bx-image-add font-size-20 ml-2"></i>
                     </Label>
                     <Row>
                        <img className="rounded" alt={edit_podcast_name} width="150" src={coverImage} style={{ height: "15vh" }} />
                     </Row>
                     <input type="file" id="input" accept="image/*" className="invisible" onChange={imageHandler} />
                  </Col>
                  <Col lg={12}>
                     <div class="custom-file mt-2 mb-3">
                        <label class="custom-file-label" for="customFile" value={edit_podcast_file}>
                           {edit_podcast_file != undefined ? (
                              edit_podcast_file.length > 35 ? (
                                 <p className="font-size-13 text-left">
                                    {edit_podcast_file.slice(0, 30)}
                                    {"..."}
                                    {edit_podcast_file.slice(edit_podcast_file.length - 3, edit_podcast_file.length)}
                                 </p>
                              ) : (
                                 <p className="font-size-13 text-left">{edit_podcast_file}</p>
                              )
                           ) : null}
                        </label>
                        <input
                           type="file"
                           class="custom-file-input"
                           accept=".mp3"
                           id="customFile"
                           onChange={ev => {
                              if (!difference_identifier.audio_file)
                                 set_difference_identifier({
                                    ...difference_identifier,
                                    audio_file: true,
                                 })
                              set_edit_podcast_file(ev.target.files[0].name)
                              set_edit_send_file(ev.target.files[0])
                           }}
                        />
                     </div>
                  </Col>
               </Row>
               <Row>
                  <Col lg={12}>
                     <p className="text-danger">{check_field}</p>
                  </Col>
               </Row>
            </SweetAlert>
         ) : null}
      </>
   )
}

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
   //
   {
      label: "Үйлдэл",
      field: "edit",
      sort: "disabled",
      width: 20,
   },
]

const List = props => {
   const [state, set_state] = useContext(ResultPopUp)

   const [latestEpisodeNumber, setLatestEpisodeNumber] = useState(0)
   const [data, set_data] = useState(props.podcasts)

   const [editEpisodeModal, setEditPodcastModal] = useState(false)
   const [confirm_edit, set_confirm_edit] = useState(false)
   const [confirm_delete, set_confirm_delete] = useState(false)
   const [delete_podcast_id, set_delete_podcast_id] = useState(null)

   const [edit_podcast_id, set_edit_podcast_id] = useState(null)

   // axios oor huselt ywuulj delete hiih
   const deletePodcast = async id => {
      const config = {
         headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      const url = `${process.env.REACT_APP_EXPRESS_BASE_URL}/podcast/${id}`
      await axios
         .delete(url, config)
         .then(async res => {
            set_state({ loading: false })
            set_state({ success: true })
            setTimeout(() => {
               window.location.reload()
            }, 1500)
         })
         .catch(e => {
            set_state({ loading: false })
            set_state({ error: true })
         })
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
                           set_edit_podcast_id(d.id)
                           setEditPodcastModal(true)
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
            {edit_podcast_id != null ? <EditPodcast editEpisodeModal={editEpisodeModal} episode_id={edit_podcast_id} setEditPodcastModal={setEditPodcastModal} /> : null}
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
                     set_confirm_delete(false)
                     set_state({ loading: true })
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
