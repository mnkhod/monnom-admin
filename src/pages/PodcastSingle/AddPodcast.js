import React, { useState, useEffect, useContext } from "react"
import { Row, Col, Card, Modal, ModalHeader, ModalBody, TabContent, TabPane, NavItem, NavLink, Label, Button, Input, Form, FormGroup, Progress } from "reactstrap"
import Switch from "react-switch"
import classnames from "classnames"
import { Link } from "react-router-dom"
import axios from "axios"
import Dropzone from "react-dropzone"
import { useParams } from "react-router-dom"
import { ResultPopUp } from "../../contexts/CheckActionsContext"
// require('dotenv').config()

const AddPodcast = props => {
   const [state, set_state] = useContext(ResultPopUp)

   const { id } = useParams()
   var latestEpisodeNumber = props.latestEpisodeNumber
   const [modal, setModal] = useState(false)
   const [activeTab, set_activeTab] = useState(1)

   const [progressValue, setprogressValue] = useState(33)
   const [podcast_name_message, set_podcast_name_message] = useState("")
   const [podcast_description_message, set_podcast_description_message] = useState("")
   const [file_upload_name_message, set_file_upload_name_message] = useState("")
   const [next_button_label, set_next_button_label] = useState("Дараах")

   // axios -oor damjuulah state uud
   const [podcast_name_value, set_podcast_name_value] = useState("")
   const [podcast_description_value, set_podcast_description_value] = useState("")
   const [checked, set_checked] = useState(false)
   const [episode_picture, set_episode_picture] = useState(null)
   const [profileImage, set_profileImage] = useState()
   const [mp3_file_duration, set_mp3_file_duration] = useState(0)
   const [selectedFiles, set_selectedFiles] = useState([])

   // update and delete
   const createPodcast = async () => {
      const url = `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-episodes`
      const podcastDataToUpload = new FormData()
      podcastDataToUpload.append("files.audio_file_path", selectedFiles, selectedFiles.name)
      podcastDataToUpload.append("files.picture", episode_picture, episode_picture.name)

      const tempSendData = {
         episode_name: podcast_name_value,
         episode_description: podcast_description_value,
         podcast_channel: id,
         episode_number: latestEpisodeNumber + 1,
         mp3_duration: mp3_file_duration,
      }
      podcastDataToUpload.append("data", JSON.stringify(tempSendData))

      const config = {
         headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      await axios
         .post(url, podcastDataToUpload, config)
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

   // podcastiin tolowiig oorchloh
   const handleChange = checked => {
      set_checked(checked)
   }

   // popup garch ireh, ustgah
   const togglemodal = () => {
      setModal(!modal)
   }

   // popup iin huudas ru usreh
   const toggleTab = tab => {
      if (activeTab !== tab) {
         if (tab >= 1 && tab <= 3) {
            set_activeTab(tab)

            if (tab === 1) {
               setprogressValue(33)
               set_next_button_label("Дараах")
            }
            if (tab === 2) {
               setprogressValue(66)
               set_next_button_label("Дараах")
            }
            if (tab === 3) {
               setprogressValue(100)
               set_next_button_label("Дуусгах")
            }
         }
      }
   }

   // file upload hiih
   const handleAcceptedFiles = files => {
      files.map(file =>
         Object.assign(file, {
            preview: URL.createObjectURL(file),
            formattedSize: formatBytes(file.size),
         })
      )

      var file = files[0]

      var reader = new FileReader()

      reader.onload = function (event) {
         var audioContext = new (window.AudioContext || window.webkitAudioContext)()

         audioContext.decodeAudioData(event.target.result, function (buffer) {
            var duration = buffer.duration
            set_mp3_file_duration(duration.toString())
         })
      }

      reader.readAsArrayBuffer(file)

      set_selectedFiles(files[0])
      set_file_upload_name_message("")
   }

   // file iin formatuud
   const formatBytes = (bytes, decimals = 2) => {
      if (bytes === 0) return "0 Bytes"
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
   }

   // zurag oorchloh
   const imageHandler = e => {
      const reader = new FileReader()
      reader.onload = () => {
         if (reader.readyState === 2) {
            set_profileImage(reader.result)
         }
      }
      reader.readAsDataURL(e.target.files[0])
      set_episode_picture(e.target.files[0])
   }

   // input textuudiin hooson utgiig shalgana
   const handle = event => {
      if (podcast_name_value === "") {
         set_podcast_name_message("Хоосон утгатай байна !")
      } else {
         set_podcast_name_message("")
      }
      if (podcast_description_value === "") {
         set_podcast_description_message("Хоосон утгатай байна !")
      } else {
         set_podcast_description_message("")
      }
   }

   useEffect(() => {
      latestEpisodeNumber = props.latestEpisodeNumber
   }, [props.latestEpisodeNumber])

   return (
      <React.Fragment>
         <Button
            type="button"
            color="success"
            onClick={() => {
               togglemodal()
            }}
         >
            <i className="bx bx-plus-medical font-size-18 d-block text-center" id="edittooltip" />
         </Button>

         <Col xs={1} class="position-relative">
            <Card>
               <Modal isOpen={modal} role="dialog" size="lg" autoFocus={true} centered={true} id="verificationModal" tabIndex="-1" toggle={togglemodal}>
                  <div className="modal-content">
                     <ModalHeader toggle={togglemodal}>Подкаст нэмэх</ModalHeader>
                     <ModalBody>
                        <div id="kyc-verify-wizard" className="twitter-bs-wizard">
                           <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
                              <NavItem>
                                 <NavLink
                                    className={classnames({
                                       active: activeTab === 1,
                                    })}
                                 >
                                    <span className="step-number mr-2">01</span>
                                    Дэлгэрэнгүй мэдээлэл оруулах
                                 </NavLink>
                              </NavItem>
                              <NavItem>
                                 <NavLink
                                    className={classnames({
                                       active: activeTab === 2,
                                    })}
                                 >
                                    <span className="step-number mr-2">02</span>
                                    Файл оруулах
                                 </NavLink>
                              </NavItem>
                              <NavItem>
                                 <NavLink
                                    className={classnames({
                                       active: activeTab === 3,
                                    })}
                                 >
                                    <span className="step-number mr-2">03</span>
                                    Баталгаажуулах
                                 </NavLink>
                              </NavItem>
                           </ul>

                           <div id="bar" className="mt-4">
                              <Progress color="success" striped animated value={progressValue} />
                              <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" />
                           </div>
                           <TabContent activeTab={activeTab} className="twitter-bs-wizard-tab-content">
                              <TabPane tabId={1} id="personal-info">
                                 <Form>
                                    <Row>
                                       <Col lg="6">
                                          <FormGroup>
                                             <Label for="kyclastname-input">Нэр</Label>
                                             <Input
                                                type="text"
                                                className="podcast_channel"
                                                required
                                                value={podcast_name_value}
                                                onChange={e => {
                                                   set_podcast_name_value(e.target.value)
                                                }}
                                             />
                                             <p class="text-danger">{podcast_name_message}</p>
                                          </FormGroup>
                                          <Row>
                                             <Col lg={12}>
                                                <FormGroup>
                                                   <Label htmlFor="productdesc">Тайлбар</Label>
                                                   <textarea
                                                      className="form-control"
                                                      id="productdesc"
                                                      rows="5"
                                                      value={podcast_description_value}
                                                      onChange={e => {
                                                         set_podcast_description_value(e.target.value)
                                                      }}
                                                   />
                                                   <p class="text-danger">{podcast_description_message}</p>
                                                </FormGroup>
                                             </Col>
                                             <Col lg={12}>
                                                <label className="d-flex">
                                                   <span className="d-block my-auto mr-3">Төлөв</span>
                                                   <Switch onChange={handleChange} checked={checked} />
                                                </label>
                                             </Col>
                                          </Row>
                                       </Col>
                                       <Col lg={1} />
                                       <Col lg={4}>
                                          <FormGroup>
                                             <Label htmlFor="productdesc">Зураг</Label>
                                             <img className="rounded" src={profileImage} alt="" id="img" className="img-fluid" />
                                             <input type="file" id="input" accept="image/*" className="invisible" onChange={imageHandler} />
                                             <div className="label">
                                                <label htmlFor="input" className="image-upload d-flex justify-content-center">
                                                   <i className="bx bx-image-add font-size-20 mr-2"></i>
                                                   <p>Зураг оруулах</p>
                                                </label>
                                             </div>
                                          </FormGroup>
                                       </Col>
                                    </Row>
                                 </Form>
                              </TabPane>
                              <TabPane tabId={2} id="doc-verification">
                                 <h5 className="font-size-14 mb-3">Баталгаажуулахын тулд файлаа оруулна уу ?</h5>
                                 <div className="kyc-doc-verification mb-3">
                                    <Dropzone
                                       onDrop={acceptedFiles => {
                                          handleAcceptedFiles(acceptedFiles)
                                       }}
                                       accept=".mp3"
                                    >
                                       {({ getRootProps, getInputProps }) => (
                                          <div className="dropzone">
                                             <div className="dz-message needsclick" {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <div className="mb-3">
                                                   <i className="display-4 text-muted bx bxs-cloud-upload"></i>
                                                </div>
                                                <h3>Файлаа энд байршуулна уу ?</h3>
                                             </div>
                                          </div>
                                       )}
                                    </Dropzone>
                                    <p className="text-danger">{file_upload_name_message}</p>
                                    <div className="dropzone-previews mt-3" id="file-previews">
                                       <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete ">
                                          <div className="p-2">
                                             <Row className="align-items-center">
                                                <Col>
                                                   <Link to="#" className="text-muted font-weight-bold">
                                                      {selectedFiles.name}
                                                   </Link>
                                                   <p className="mb-0">
                                                      <strong>{selectedFiles.formattedSize}</strong>
                                                   </p>
                                                </Col>
                                             </Row>
                                          </div>
                                       </Card>
                                    </div>
                                 </div>
                              </TabPane>
                              <TabPane tabId={3} id="personal-info">
                                 <div className="row justify-content-center">
                                    <Col lg="6">
                                       <div className="text-center">
                                          <div className="mb-4">
                                             <i className="mdi mdi-check-circle-outline text-success display-4" />
                                          </div>
                                          <div>
                                             <h5>Баталгаажуулах</h5>
                                             <p className="text-muted">Та баталгаажуулахын тулд "Дуусгах" товчийг дарна уу ?</p>
                                          </div>
                                       </div>
                                    </Col>
                                 </div>
                              </TabPane>
                           </TabContent>
                           <ul className="pager wizard twitter-bs-wizard-pager-link">
                              <li className={activeTab === 1 ? "previous disabled" : "previous"}>
                                 <Link
                                    to="#"
                                    onClick={() => {
                                       toggleTab(activeTab - 1)
                                    }}
                                 >
                                    Өмнөх
                                 </Link>
                              </li>
                              <li className={activeTab === 4 ? "next disabled" : "next"}>
                                 <Link
                                    to="#"
                                    onClick={e => {
                                       handle(e)

                                       if (activeTab === 1 && podcast_name_value !== "" && podcast_description_value !== "") {
                                          toggleTab(activeTab + 1)
                                       }
                                       if (activeTab === 2 && selectedFiles.length != 0) {
                                          toggleTab(activeTab + 1)
                                       } else {
                                          set_file_upload_name_message("Хоосон утгатай байна !")
                                       }
                                       if (next_button_label == "Дуусгах") {
                                          togglemodal()
                                          set_state({ loading: true })
                                          createPodcast()

                                          // setsuccess_dlg(true)
                                       }
                                    }}
                                 >
                                    {next_button_label}
                                 </Link>
                              </li>
                           </ul>
                        </div>
                     </ModalBody>
                  </div>
               </Modal>
            </Card>
         </Col>
      </React.Fragment>
   )
}

export default AddPodcast
