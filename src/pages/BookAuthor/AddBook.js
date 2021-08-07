import React, { useState, useEffect, useContext } from "react"
import { Row, Col, Card, Modal, ModalHeader, ModalBody, TabContent, TabPane, NavItem, NavLink, Progress, Label, Button, Input, Form, FormGroup } from "reactstrap"
import axios from "axios"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import Dropzone from "react-dropzone"
import Switch from "react-switch"
import classnames from "classnames"
import { Link } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
import Select from "react-select"
import { ResultPopUp } from "contexts/CheckActionsContext"

const AddBook = props => {
   const [state, set_state] = useContext(ResultPopUp)

   const [netWork, set_netWork] = useState(false)
   const [modal, setModal] = useState(false)
   const [activeTab, set_activeTab] = useState(1)
   const [progressValue, setprogressValue] = useState(33)
   const [book_name_message, set_book_name_message] = useState("")
   const [checked, set_checked] = useState(false)
   const [progress_mp3, set_progress_mp3] = useState(0)
   const [next_button_label, set_next_button_label] = useState("Дараах")
   const [profileImage, set_profileImage] = useState("")
   const [confirm_edit, set_confirm_edit] = useState(false)
   const [file_upload_name_message, set_file_upload_name_message] = useState("")
   const [youtube_url_name, set_youtube_url_name] = useState("")
   const [category_of_book_message, set_category_of_book_message] = useState("")
   const [author_of_book_message, set_author_of_book_message] = useState("")
   const [optionGroup_authors, set_optionGroup_authors] = useState([])
   const [optionGroup_categories, set_optionGroup_categories] = useState([])
   const [is_pdf_price, set_is_pdf_price] = useState(false)
   const [book_introduction_message, set_book_introduction_message] = useState("")
   const [files_checked, set_files_checked] = useState("")

   // axios -oor damjuulah state set
   const [pdf_price, set_pdf_price] = useState(0)
   const [ebook_price, set_ebook_price] = useState(0)
   const [audio_book_price, set_audio_book_price] = useState(0)
   const [youtube_url_value, set_youtube_url_value] = useState("")
   const [book_introduction_value, set_book_introduction_value] = useState("")

   const [selectedFiles, set_selectedFiles] = useState([])

   const [book_name_value, set_book_name_value] = useState("")
   const [book_picture, set_book_picture] = useState(null)
   const [featuredPicture, setFeaturedPicture] = useState(null)
   const [featureUrl, setFeatureUrl] = useState('')
   const [audio_book_files, set_audio_book_files] = useState([])
   const [audio_book_files_for_save, set_audio_book_files_for_save] = useState([])
   const [book_files, set_book_files] = useState([])
   const [epub_file, set_epub_file] = useState([])
   const [selectedMulti_category, setselectedMulti_category] = useState(null)
   const [selectedMulti_author, setselectedMulti_author] = useState(null)
   const [sale_count, set_sale_count] = useState(0)
   const [sale_price, set_sale_price] = useState(0)

   // create
   const createBook = async () => {
      const formData = new FormData()

      let categories = selectedMulti_category.map(cat => cat.value.toString())
      let authors = selectedMulti_author.map(author => author.value.toString())

      let data = {}

      data["name"] = book_name_value
      data["has_sale"] = sale_count != 0 ? true : false
      data["sale_quantity"] = sale_count
      data["has_audio"] = audio_book_files.length != 0 ? true : false
      data["has_pdf"] = book_files.length != 0 || epub_file.length != 0 ? true : false
      data["book_categories"] = categories
      data["users_permissions_user"] = props.user_id
      data["youtube_intro"] = youtube_url_value
      data["introduction"] = book_introduction_value
      data["book_authors"] = authors
      data["online_book_price"] = pdf_price
      data["book_price"] = sale_price
      data["audio_book_price"] = audio_book_price
      data["is_ebook_epub"] = epub_file.length > 0 ? true : false
      data["is_ebook_pdf"] = book_files.length > 0 ? true : false

      formData.append("data", JSON.stringify(data))
      if (book_files[0] != undefined) formData.append("files.pdf_book_path", book_files[0], book_files[0].name)
      if (epub_file[0] != undefined) formData.append('files.epub_book_path', epub_file[0], epub_file[0].name)
      if (featuredPicture != null) formData.append("files.featured_picture", featuredPicture, featuredPicture.name)

      formData.append("files.picture", book_picture, book_picture.name)
      for (let i = 0; i < selectedFiles.length; i++) {
         formData.append("files.picture_comment", selectedFiles[i], selectedFiles[i].name)
      }

      const config = {
         headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }
      await axios.post(`${process.env.REACT_APP_STRAPI_BASE_URL}/books`, formData, config).then(async res => {
         let tempAudioRequests = []
         let promises = []

         audio_book_files_for_save.forEach((file, index) => {
            promises.push(
               getAudioFileDuration(audio_book_files_for_save[index])
                  .then(resp => {
                     let audio_duration = resp
                     let tempFormData = new FormData()
                     let data = {
                        chapter_name: audio_book_files_for_save[index].name.split(".").slice(0, -1).join("."),
                        book: res.data.id,
                        number: index,
                        audio_duration: audio_duration.toString(),
                     }
                     tempFormData.append("data", JSON.stringify(data))
                     tempFormData.append("files.mp3_file", audio_book_files_for_save[index])
                     tempAudioRequests.push({
                        url: `${process.env.REACT_APP_STRAPI_BASE_URL}/book-audios`,
                        formdata: tempFormData,
                     })
                  })
                  .catch(err => { })
            )
         })

         Promise.all(promises)
            .then(() => {
               axios
                  .all(tempAudioRequests.map(tempRequest => axios.post(tempRequest.url, tempRequest.formdata, config)))
                  .then(() => {
                     set_state({ loading: false })
                     set_state({ success: true })
                     setTimeout(() => {
                        window.location.reload()
                     }, 1500)
                  })
                  .catch(err => {
                     set_state({ loading: false })
                     set_state({ error: true })
                  })
            })
            .catch(e => {
               set_state({ loading: false })
               seterror_dialog(true)
            })
      })
   }

   const getAudioFileDuration = file =>
      new Promise((resolve, reject) => {
         let audio = document.createElement('audio');
         let objectUrl = URL.createObjectURL(file);
         audio.src = objectUrl;
         audio.addEventListener('loadedmetadata', () => {
            console.log(`audio duration: ${audio.duration}`);
            resolve(audio.duration);
         })
         // let reader = new FileReader()
         // reader.onload = function (event) {
         //    let audioContext = new (window.AudioContext || window.webkitAudioContext)()
         //    audioContext.decodeAudioData(event.target.result).then(buffer => {
         //       resolve(buffer.duration)
         //    })
         // }
         // reader.readAsArrayBuffer(file)
      })

   // props oos irsen nomnii categoruudiig awah
   const getAuthorsCategoriesInfo = (authors, categories) => {
      const a = authors.map(author => {
         return {
            label: author.author_name,
            value: author.id,
         }
      })
      set_optionGroup_authors(a)

      const c = categories.map(category => {
         return {
            label: category.name,
            value: category.id,
         }
      })
      set_optionGroup_categories(c)
   }

   useEffect(() => {
      getAuthorsCategoriesInfo(props.available_authors, props.available_categories)
      // makeGetReq()
   }, [])

   // file upload hiih
   const handleAcceptedFiles = files => {
      files.map(file =>
         Object.assign(file, {
            preview: URL.createObjectURL(file),
            formattedSize: formatBytes(file.size),
         })
      )
      set_selectedFiles(files)
      if (selectedFiles) {
         set_file_upload_name_message("")
      }
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

   // Nomiig hudaldah esehiig asuuj input nemne
   const handleChange = checked => {
      set_checked(checked)
   }

   // popup garch ireh, arilgahad tuslah
   const togglemodal = () => {
      setModal(!modal)
   }

   // popup iin huudas ru usreh
   const toggleTab = tab => {
      if (activeTab !== tab) {
         if (tab >= 1 && tab <= 3) {
            set_activeTab(tab)

            if (tab === 1) {
               setprogressValue(33.3)
               set_next_button_label("Дараах")
            }
            if (tab === 2) {
               setprogressValue(66.6)
               if (book_files.length == 0 && audio_book_files == 0) set_next_button_label("Алгасах")
               else set_next_button_label("Дараах")
            }
            if (tab === 3) {
               setprogressValue(100)
               set_next_button_label("Дуусгах")
            }
         }
      }
   }

   // podcastiin zurag solih
   const imageHandler = e => {
      const reader = new FileReader()
      reader.onload = () => {
         if (reader.readyState === 2) {
            set_profileImage(reader.result)
         }
      }
      reader.readAsDataURL(e.target.files[0])
      set_book_picture(e.target.files[0])
   }

   const handleFeaturePicture = f => {
      const reader = new FileReader()
      reader.onload = () => {
         if (reader.readyState === 2) {
            setFeatureUrl(reader.result)
         }
      }
      reader.readAsDataURL(f.target.files[0])
      setFeaturedPicture(f.target.files[0])
   }

   // inputiin utga hooson esehiig shalgah
   const handle1 = () => {
      if (book_name_value === "") {
         set_book_name_message("Хоосон утгатай байна !")
      } else {
         set_book_name_message("")
      }

      if (selectedMulti_category == null) {
         set_category_of_book_message("Хоосон утгатай байна !")
      }

      if (selectedMulti_author == null) {
         set_author_of_book_message("Хоосон утгатай байна !")
      }
   }

   const handle2 = () => {
      if (youtube_url_value === "") {
         set_youtube_url_name("Хоосон утгатай байна !")
      } else {
         set_youtube_url_name("")
      }
      if (book_introduction_value === "") {
         set_book_introduction_message("Хоосон утгатай байна !")
      } else {
         set_book_introduction_message("")
      }
   }

   // mp3 file upload hiih, nemeh
   const uploadAudioBook = e => {
      let files = e.target.files
      let tempfiles = []
      for (let i = 0; i < files.length; i++) {
         tempfiles.push(files[i])
      }
      set_audio_book_files_for_save(tempfiles)
      set_audio_book_files(getItems(files))
      set_next_button_label("Дараах")
   }

   // upload hiij bga mp3 file aa ustgah
   const removeAudioBookFiles = f => {
      set_audio_book_files(audio_book_files.filter(x => x !== f))
      set_audio_book_files_for_save(Array.from(audio_book_files_for_save).filter(file => file.name != f.content))
      if (audio_book_files.length == 1 && book_files.length == 0) {
         set_next_button_label("Алгасах")
      } else {
         set_next_button_label("Дараах")
      }
   }

   // pdf file upload hiih
   const uploadBook = e => {
      var files = e.target.files

      set_book_files([files[0]])

      if (book_files.length == 0 && audio_book_files.length == 0) {
         set_next_button_label("Дараах")
         set_is_pdf_price(true)
      } else {
         set_next_button_label("Алгасах")
      }
   }

   // upload hiisen pdf file aa ustgah
   const removeBookFiles = f => {
      set_progress_mp3(0)
      set_book_files(book_files.filter(x => x !== f))
      set_is_pdf_price(false)
      if (audio_book_files.length == 0) {
         set_next_button_label("Алгасах")
      } else {
         set_next_button_label("Дараах")
      }
   }

   // epub file upload hiih
   const uploadEpub = e => {
      let file = e.target.files

      set_epub_file([file[0]])

      if (epub_file.length == 0 && audio_book_files.length == 0) {
         set_next_button_label("Дараах")
         set_is_pdf_price(true)
      } else {
         set_next_button_label("Алгасах")
      }
   }

   // upload hsen epub file aa ustgah
   const removeEpub = f => {
      set_progress_mp3(0)
      set_epub_file(epub_file.filter(x => x !== f))
      set_is_pdf_price(true)

      if (audio_book_files.length == 0) {
         set_next_button_label("Алгасах")
      } else {
         set_next_button_label("Дараах")
      }
   }

   // upload hiisen file uudiin zooh, indexuudiig zaaj ogoh
   const onDragEnd = result => {
      // dropped outside the list
      if (!result.destination) {
         return
      }

      const items = reorder(audio_book_files, result.source.index, result.destination.index)

      set_audio_book_files(items)
   }

   // multiple book categories
   function handleMulti_category(selected_category) {
      setselectedMulti_category(selected_category)
      set_category_of_book_message("")
   }

   // multiple book categories
   function handleMulti_author(selected_author) {
      setselectedMulti_author(selected_author)
      set_author_of_book_message("")
   }

   return (
      <React.Fragment>
         <Button type="button" color="success" onClick={togglemodal}>
            <i className="bx bx-plus-medical font-size-18 text-center" id="edittooltip" />
         </Button>
         {netWork === false ? (
            <Col xs={1}>
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
                        set_state({ loading: true })
                        createBook()
                     }}
                     onCancel={() => {
                        set_confirm_edit(false)
                        togglemodal()
                     }}
                  ></SweetAlert>
               ) : null}
               <Card>
                  <Modal isOpen={modal} role="dialog" size="lg" autoFocus={true} centered={true} id="verificationModal" tabIndex="-1" toggle={togglemodal}>
                     <div className="modal-content">
                        <ModalHeader toggle={togglemodal}>Ном нэмэх</ModalHeader>
                        <ModalBody>
                           <div id="kyc-verify-wizard" className="twitter-bs-wizard">
                              <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
                                 <NavItem>
                                    <NavLink
                                       className={classnames({
                                          active: activeTab === 1,
                                       })}
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          height: "100%",
                                       }}
                                    >
                                       <span className="step-number mr-2">01</span>
                                       <p className="my-auto">Ерөнхий мэдээлэл</p>
                                    </NavLink>
                                 </NavItem>
                                 <NavItem>
                                    <NavLink
                                       className={classnames({
                                          active: activeTab === 2,
                                       })}
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          height: "100%",
                                       }}
                                    >
                                       <span className="step-number mr-2">02</span>
                                       <p className="my-auto">Файл оруулах</p>
                                    </NavLink>
                                 </NavItem>
                                 <NavItem>
                                    <NavLink
                                       className={classnames({
                                          active: activeTab === 3,
                                       })}
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          height: "100%",
                                       }}
                                    >
                                       <span className="step-number mr-2">03</span>
                                       <p className="my-auto">Нэмэлт мэдээлэл</p>
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
                                          <Col lg="7">
                                             <FormGroup>
                                                <Label for="kycfirstname-input">Номын нэр</Label>
                                                <Input
                                                   type="text"
                                                   className="podcast_channel"
                                                   required
                                                   value={book_name_value}
                                                   onChange={e => {
                                                      set_book_name_value(e.target.value)
                                                   }}
                                                />
                                                <p className="text-danger font-size-10">{book_name_message}</p>
                                             </FormGroup>
                                             <Row>
                                                <Col lg={12}>
                                                   <FormGroup className="select2-container">
                                                      <label className="control-label">Номны төрөл</label>
                                                      <Select
                                                         value={selectedMulti_category}
                                                         isMulti={true}
                                                         placeholder="Сонгох ... "
                                                         onChange={e => {
                                                            handleMulti_category(e)
                                                         }}
                                                         options={optionGroup_categories}
                                                         classNamePrefix="select2-selection"
                                                      />
                                                      <p class="text-danger">{category_of_book_message}</p>
                                                   </FormGroup>
                                                </Col>
                                                <Col lg="12">
                                                   <FormGroup className="select2-container">
                                                      <label className="control-label">Номны зохиогч</label>
                                                      <Select
                                                         value={selectedMulti_author}
                                                         isMulti={true}
                                                         placeholder="Сонгох ... "
                                                         onChange={e => {
                                                            handleMulti_author(e)
                                                         }}
                                                         options={optionGroup_authors}
                                                         classNamePrefix="select2-selection"
                                                      />
                                                      <p className="text-danger font-size-10">{author_of_book_message}</p>
                                                   </FormGroup>
                                                </Col>
                                                <Col lg="8">
                                                   <FormGroup>
                                                      <img
                                                         className="rounded"
                                                         src={featureUrl}
                                                         alt={book_name_value}
                                                         id="img"
                                                         className="img-fluid"
                                                         style={{ width: "400px", height: "200px" }}
                                                      />
                                                      <input type="file" id="feature" accept="image/*" className="invisible" onChange={handleFeaturePicture} />
                                                      <div className="label">
                                                         <label htmlFor="feature" className="image-upload d-flex justify-content-center" style={{ cursor: "pointer" }}>
                                                            <i className="bx bx-image-add font-size-20 mr-2"></i>
                                                            <p>Нэмэлт зураг оруулах</p>
                                                         </label>
                                                      </div>
                                                   </FormGroup>
                                                </Col>
                                             </Row>
                                          </Col>
                                          <Col lg={5}>
                                             <FormGroup className="mx-auto" style={{ width: "85%" }}>
                                                <Label htmlFor="productdesc">Зураг</Label>
                                                <img
                                                   className="rounded"
                                                   src={profileImage}
                                                   alt={book_name_value}
                                                   id="img"
                                                   className="img-fluid"
                                                   style={{
                                                      width: "100%",
                                                      height: "30vh",
                                                   }}
                                                />
                                                <input type="file" id="input" accept="image/*" className="invisible" onChange={imageHandler} />
                                                <div className="label">
                                                   <label htmlFor="input" className="image-upload d-flex justify-content-center" style={{ cursor: "pointer" }}>
                                                      <i className="bx bx-image-add font-size-20 mr-2"></i>
                                                      <p>Зураг оруулах</p>
                                                   </label>
                                                </div>
                                             </FormGroup>
                                          </Col>
                                       </Row>

                                       <Row>
                                          {/* <Col lg="7">
                              <FormGroup>
                                <Label htmlFor="productdesc">Тайлбар</Label>
                                <textarea
                                  className="form-control"
                                  id="productdesc"
                                  rows="5"
                                  value={book_description_value}
                                  onChange={e => {
                                    set_book_description_value(e.target.value)
                                  }}
                                />
                                <p class="text-danger">
                                  {podcast_description_message}
                                </p>
                              </FormGroup>
                            </Col> */}
                                       </Row>
                                       <Row>
                                          <Col lg={4} className="d-flex mt-3">
                                             <label className="d-flex">
                                                <span className="d-block my-auto mr-3">Зарж байгаа юу ?</span>
                                                <Switch onChange={handleChange} checked={checked} />
                                             </label>
                                          </Col>
                                       </Row>
                                       <Row>
                                          {checked ? (
                                             <>
                                                <Col lg={3} className="my-auto">
                                                   <Label for="exampleSelect1">Зарагдах тоо оруулах</Label>
                                                </Col>
                                                <Col lg={3}>
                                                   <Input type="number" value={sale_count} onChange={e => set_sale_count(e.target.value)} />
                                                </Col>
                                                <Col lg={3} className="my-auto">
                                                   <Label for="exampleSelect1" className="text-right w-100">
                                                      Нэг бүрийн үнэ
                                                   </Label>
                                                </Col>
                                                <Col lg={3}>
                                                   <Input type="number" value={sale_price} onChange={e => set_sale_price(e.target.value)} />
                                                </Col>
                                             </>
                                          ) : null}
                                       </Row>
                                    </Form>
                                 </TabPane>

                                 <TabPane tabId={2} id="doc-verification">
                                    <h5 className="font-size-14 mb-3">Баталгаажуулахын тулд файлаа оруулна уу ?</h5>

                                    <Row>
                                       <Col lg={6}>
                                          {book_files.length != 0 || epub_file.length != 0 ? (
                                             <FormGroup>
                                                <Label>Эй бүүк үнэ</Label>
                                                <Input type="number" value={pdf_price} onChange={e => set_pdf_price(e.target.value)}></Input>
                                             </FormGroup>
                                          ) : null}
                                       </Col>
                                       <Col lg={6}>
                                          {audio_book_files.length != 0 ? (
                                             <FormGroup>
                                                <Label>Аудио бүүк үнэ</Label>
                                                <Input type="number" value={audio_book_price} onChange={e => set_audio_book_price(e.target.value)}></Input>
                                             </FormGroup>
                                          ) : (
                                             []
                                          )}
                                       </Col>
                                    </Row>

                                    <Row style={{ borderBottom: "1px solid #1f3bcc" }}>
                                       <Col xl={8}>
                                          {book_files.map((file, index) => (
                                             <div className="d-flex justify-content-between bg-light border  rounded py-2 px-3 mb-3 align-items-center" style={{ width: "450px", marginLeft: "10px" }} key={index}>
                                                <i className="bx bxs-file font-size-22 text-danger mr-2" />
                                                <p
                                                   style={{
                                                      overflow: "hidden",
                                                      color: "#000",
                                                      margin: "auto",
                                                      marginLeft: "0",
                                                      width: "85%",
                                                   }}
                                                >
                                                   {file.name}
                                                </p>
                                                <i
                                                   className="dripicons-cross font-size-20 my-auto text-dark"
                                                   onClick={removeBookFiles.bind(this, file)}
                                                   style={{
                                                      cursor: "pointer",
                                                      margin: "auto",
                                                      marginRight: "0",
                                                   }}
                                                />
                                             </div>
                                          ))}
                                          {epub_file.map((file, index) => (
                                             <div className="d-flex justify-content-between bg-light border  rounded py-2 px-3 mb-3 align-items-center" style={{ width: "450px", marginLeft: "10px" }} key={index}>
                                                <i className="bx bxs-file font-size-22 text-danger mr-2" />
                                                <p
                                                   style={{
                                                      overflow: "hidden",
                                                      color: "#000",
                                                      margin: "auto",
                                                      marginLeft: "0",
                                                      width: "85%",
                                                   }}
                                                >
                                                   {file.name}
                                                </p>
                                                <i
                                                   className="dripicons-cross font-size-20 my-auto text-dark"
                                                   onClick={removeEpub.bind(this, file)}
                                                   style={{
                                                      cursor: "pointer",
                                                      margin: "auto",
                                                      marginRight: "0",
                                                   }}
                                                />
                                             </div>
                                          ))}
                                          {progress_mp3 > 0 ? (
                                             <div className="progress mt-2 w-60 mx-auto">
                                                <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow={progress_mp3} aria-valuemin="0" aria-valuemax="100" style={{ width: progress_mp3 + "%" }}>
                                                   {progress_mp3}%
                                                </div>
                                             </div>
                                          ) : null}
                                       </Col>
                                       <Col xl={2} className="mb-2" style={{ borderLeft: "1px solid #000" }}>
                                          <label className="custom-file-upload d-flex">
                                             <input
                                                type="file"
                                                accept=".pdf"
                                                disabled={epub_file.length > 0 ? true : false}
                                                style={{
                                                   display: "none",
                                                }}
                                                onChange={e => uploadBook(e)}
                                             />
                                             <i
                                                className={`btn-rounded font-size-15 text-dark py-2 px-3 btn ${epub_file.length ? 'btn-secondary' : 'btn-danger'}`}
                                                style={{
                                                   cursor: "pointer",
                                                }}
                                             >
                                                pdf ном
                                             </i>
                                          </label>
                                       </Col>
                                       <Col xl={2} className="mb-2">
                                          <label className="custom-file-upload d-flex">
                                             <input
                                                type="file"
                                                accept=".epub"
                                                disabled={book_files.length > 0 ? true : false}
                                                style={{
                                                   display: "none",
                                                }}
                                                onChange={e => uploadEpub(e)}
                                             />
                                             <i
                                                className={`btn-rounded font-size-15 text-dark py-2 px-3 btn ${book_files.length ? 'btn-secondary' : 'btn-warning'}`}
                                                style={{
                                                   cursor: "pointer",
                                                }}
                                             >
                                                epub ном
                                             </i>
                                          </label>
                                       </Col>
                                    </Row>
                                    <Row style={{ borderTop: "1px solid #1f3bcc" }}>
                                       <Col xl={8} style={{ paddingTop: "20px" }}>
                                          <DragDropContext onDragEnd={onDragEnd} className="bt-5">
                                             <Droppable droppableId="droppable">
                                                {(provided, snapshot) => (
                                                   <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                                                      {audio_book_files.map((item, index) => (
                                                         <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(provided, snapshot) => (
                                                               <div
                                                                  className="file-preview bg-light d-flex py-2 px-3 text-white justify-content-between align-items-center border rounded mt-3"
                                                                  ref={provided.innerRef}
                                                                  {...provided.draggableProps}
                                                                  {...provided.dragHandleProps}
                                                                  style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                               >
                                                                  <i className="bx bxs-music font-size-22 text-warning mr-2" />
                                                                  <p
                                                                     style={{
                                                                        overflow: "hidden",
                                                                        color: "#000",
                                                                        margin: "auto",
                                                                        marginLeft: "0",
                                                                        width: "85%",
                                                                     }}
                                                                  >
                                                                     {item.content}
                                                                  </p>
                                                                  <i
                                                                     className="dripicons-cross font-size-20 my-auto text-dark"
                                                                     onClick={removeAudioBookFiles.bind(this, item)}
                                                                     style={{
                                                                        cursor: "pointer",
                                                                        margin: "auto",
                                                                        marginRight: "0",
                                                                     }}
                                                                  />
                                                               </div>
                                                            )}
                                                         </Draggable>
                                                      ))}
                                                      {provided.placeholder}
                                                   </div>
                                                )}
                                             </Droppable>
                                          </DragDropContext>
                                       </Col>
                                       <Col xl={4} className="mt-2" style={{ borderLeft: "1px solid #000" }}>
                                          <label className="custom-file-upload">
                                             <input type="file" accept=".mp3" multiple className="invisible" onChange={e => uploadAudioBook(e)} />
                                             <i
                                                className="font-size-15 py-2 px-3 btn btn-info btn-rounded text-dark"
                                                style={{
                                                   cursor: "pointer",
                                                }}
                                             >
                                                аудио ном
                                             </i>
                                          </label>
                                       </Col>
                                    </Row>
                                    <Col lg={12} className="text-danger">
                                       {files_checked}
                                    </Col>
                                 </TabPane>

                                 <TabPane tabId={3} id="comments">
                                    <Form>
                                       <Row>
                                          <Col lg={6}>
                                             <FormGroup>
                                                <Label for="kycfirstname-input">Юү түүб хаяг</Label>
                                                <Input
                                                   type="text"
                                                   required
                                                   value={youtube_url_value}
                                                   onChange={e => {
                                                      set_youtube_url_value(e.target.value)
                                                   }}
                                                />
                                                <p className="text-danger font-size-10">{youtube_url_name}</p>
                                             </FormGroup>
                                             <Row></Row>
                                          </Col>
                                          <Col lg={6}>
                                             <FormGroup>
                                                <Label htmlFor="productdesc">Танилцуулга</Label>
                                                <textarea
                                                   className="form-control"
                                                   id="productdesc"
                                                   rows="5"
                                                   value={book_introduction_value}
                                                   onChange={e => {
                                                      set_book_introduction_value(e.target.value)
                                                   }}
                                                />
                                                <p className="text-danger font-size-10">{book_introduction_message}</p>
                                             </FormGroup>
                                          </Col>
                                       </Row>
                                       <Row>
                                          <Col lg={12}>
                                             <h5 className="font-size-14 mb-3">Ишлэл</h5>
                                             <div className="kyc-doc-verification mb-3">
                                                <Dropzone
                                                   onDrop={acceptedFiles => {
                                                      handleAcceptedFiles(acceptedFiles)
                                                   }}
                                                   accept="image/*"
                                                >
                                                   {({ getRootProps, getInputProps }) => (
                                                      <div className="dropzone">
                                                         <div className="dz-message needsclick" {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            <div className="mb-3">
                                                               <i className="display-4 text-muted bx bxs-cloud-upload"></i>
                                                            </div>
                                                            <h3>Зурагаа энд байршуулна уу ?</h3>
                                                         </div>
                                                      </div>
                                                   )}
                                                </Dropzone>
                                                <p className="text-danger">{file_upload_name_message}</p>
                                                <div className="dropzone-previews mt-3" id="file-previews">
                                                   {selectedFiles.map((f, i) => {
                                                      return (
                                                         <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete " key={i + "-file"}>
                                                            <div className="p-2">
                                                               <Row className="align-items-center">
                                                                  <Col>
                                                                     <Link to="#" className="text-muted font-weight-bold">
                                                                        {f.name}
                                                                     </Link>
                                                                     <p className="mb-0">
                                                                        <strong>{f.formattedSize}</strong>
                                                                     </p>
                                                                  </Col>
                                                               </Row>
                                                            </div>
                                                         </Card>
                                                      )
                                                   })}
                                                </div>
                                             </div>
                                          </Col>
                                       </Row>
                                    </Form>
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
                                          handle1(e)
                                          if (activeTab === 1 && book_name_value !== "" && selectedMulti_category != null && selectedMulti_author != null) {
                                             toggleTab(activeTab + 1)
                                          }
                                          if (activeTab == 2 && (next_button_label == "Алгасах" || next_button_label == "Дараах")) {
                                             if (book_files.length != 0 && ebook_price <= 0) {
                                                set_files_checked("Үнийн дүн оруулна уу ?")
                                             } else {
                                                toggleTab(activeTab + 1)
                                                set_files_checked("")
                                             }

                                             if (audio_book_files.length != 0 && audio_book_price <= 0) {
                                                set_files_checked("Үнийн дүн оруулна уу ?")
                                             } else {
                                                toggleTab(activeTab + 1)
                                                set_files_checked("")
                                             }
                                          }
                                          if (activeTab === 3) {
                                             handle2(e)
                                          }
                                          if (next_button_label == "Дуусгах" && youtube_url_value !== "" && book_introduction_value !== "") {
                                             togglemodal()
                                             set_confirm_edit(true)
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
         ) : null}
      </React.Fragment>
   )
}

// file  generator
const getItems = files => {
   let tempArray = []
   Object.keys(files).map((key, index) => {
      tempArray.push({
         id: `item-${index}`,
         content: files[key].name,
      })
   })
   return tempArray
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
   const result = Array.from(list)
   const [removed] = result.splice(startIndex, 1)
   result.splice(endIndex, 0, removed)

   return result
}

const GRID = 8

const getItemStyle = (isDragging, draggableStyle) => ({
   // some basic styles to make the items look a bit nicer
   userSelect: "none",
   padding: GRID * 2,
   margin: `0 0 ${GRID}px 0`,
   width: 450,
   // styles we need to apply on draggables
   ...draggableStyle,
})

const getListStyle = isDraggingOver => ({
   background: isDraggingOver ? "lightgreen" : "white",
   padding: GRID,
   width: 460,
})

export default AddBook
