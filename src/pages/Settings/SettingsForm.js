import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import SweetAlert from "react-bootstrap-sweetalert"
import { Card, CardBody, Col, Row, CardTitle, Button, Label, Alert } from "reactstrap"
import Select from "react-select"
import { Link } from "react-router-dom"
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { EditorState, convertToRaw, convertFromHTML, ContentState } from "draft-js"
import draftToHtml from "draftjs-to-html"
import { ResultPopUp } from "../../contexts/CheckActionsContext"
import BlogCategoryCrud from "./BookCategoryCrud"

const SettingsForm = props => {
   const [state, set_state] = useContext(ResultPopUp)

   // Check network
   const [isNetworkingError, setIsNetworkingError] = useState(false)
   const [isNetworkLoading, setIsNetworkLoading] = useState(true)

   const [old_author_category, set_old_author_category] = useState([])
   const [new_author_category, set_new_author_category] = useState("")
   const [old_book_category, set_old_book_category] = useState([])
   const [new_book_category, set_new_book_category] = useState("")
   const [old_podcast_category, set_old_podcast_category] = useState([])
   const [new_podcast_category, set_new_podcast_category] = useState("")
   const [all_admins, set_all_admins] = useState([])
   const [all_books, set_all_books] = useState([])
   const [all_channels, set_all_channels] = useState([])

   const [channel_name, set_channel_name] = useState("")
   const [podcast_category, set_podcast_category] = useState([])
   const [selectedMulti_category, setSelectedMulti_category] = useState(null)
   const [admin_selected, set_admin_selected] = useState(null)
   const [podcast_pic, set_podcast_pic] = useState("")
   const [channel_desc, set_channel_desc] = useState("")

   const [channel_cover_pic, set_channel_cover_pic] = useState(null)
   const [podcast_category_id, set_podcast_category_id] = useState(null)
   const [book_category_id, set_book_category_id] = useState(null)
   const [author_category_id, set_author_category_id] = useState(null)
   const [special_book_id, set_special_book_id] = useState(null)
   const [insert_channels_id, set_insert_channels_id] = useState(null)

   const [confirm_terms, set_confirm_terms] = useState(false)
   const [confirm_save_book, set_confirm_save_book] = useState(false)
   const [confirm_add_author, set_confirm_add_author] = useState(false)
   const [confirm_remove_author, set_confirm_remove_author] = useState(false)
   const [confirm_delete_channel, set_confirm_delete_channel] = useState(false)
   const [confirm_add_book_category, set_confirm_add_book_category] = useState(false)
   const [confirm_remove_book_category, set_confirm_remove_book_category] = useState(false)
   const [confirm_add_podcast_category, set_confirm_add_podcast_category] = useState(false)
   const [confirm_remove_podcast_category, set_confirm_remove_podcast_category] = useState(false)
   const [confirm_add_podcast_channel, set_confirm_add_podcast_channel] = useState(false)

   const [wysiwyg_content, set_wysiwyg_content] = useState(EditorState.createEmpty())
   const [termsData, setTermsData] = useState(false)

   const addBookCategory = async () => {
      const formData = new FormData()

      formData.append("book_authors.label", new_book_category)

      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }
      await axios
         .post(`${process.env.REACT_APP_STRAPI_BASE_URL}/book-categories`, { name: new_book_category }, config)
         .then(res => {
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

   const addBookAuthor = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      await axios
         .post(
            `${process.env.REACT_APP_STRAPI_BASE_URL}/book-authors`,
            {
               author_name: new_author_category,
            },
            config
         )
         .then(res => {
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

   const deleteBookCategory = async id => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      await axios
         .delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/book-categories/${book_category_id}`, config)
         .then(async res => {
            set_state({ loading: false })
            set_state({ success: true })
            setTimeout(() => {
               window.location.reload()
            }, 2000)
         })
         .catch(res => {
            set_state({ loading: false })
            set_state({ error: true })
         })
   }

   const deleteBookAuthor = async id => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }
      await axios
         .delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/book-authors/${id}`, config)
         .then(async res => {
            set_state({ loading: false })
            set_state({ success: true })
            setTimeout(() => {
               window.location.reload()
            }, 2000)
         })
         .catch(res => {
            set_state({ loading: false })
            set_state({ error: true })
         })
   }

   const deletePodcastCategory = async id => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }
      await axios
         .delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-categories/${id}`, config)
         .then(async res => {
            set_state({ loading: false })
            set_state({ success: true })
            setTimeout(() => {
               window.location.reload()
            }, 2000)
         })
         .catch(res => {
            set_state({ loading: false })
            set_state({ error: true })
         })
   }

   const addPodcastCategory = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }
      await axios
         .post(
            `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-categories`,
            {
               name: new_podcast_category,
            },
            config
         )
         .then(res => {
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

   const saveBook = async () => {
      const config = {
         headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}` },
      }

      await axios
         .put(`${process.env.REACT_APP_STRAPI_BASE_URL}/special-book/`, { book: special_book_id }, config)
         .then(async => {
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

   const createPodcastChannel = async () => {
      const formData = new FormData()

      let data = { name: channel_name, users_permissions_user: admin_selected, description: channel_desc, podcast_categories: selectedMulti_category.map(cat => cat.value.toString()) }

      formData.append("data", JSON.stringify(data))
      formData.append("files.cover_pic", channel_cover_pic, channel_cover_pic.name)

      const config = {
         headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      await axios
         .post(`${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-channels`, formData, config)
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

   const updateTerms = async () => {
      const url = `${process.env.REACT_APP_EXPRESS_BASE_URL}/terms-and-conditions`
      const formData = new FormData()
      formData.append("terms", draftToHtml(convertToRaw(wysiwyg_content.getCurrentContent())))
      const config = {
         headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}` },
      }
      axios
         .put(url, formData, config)
         .then(res => {
            set_state({ loading: false })
            set_state({ success: true })
            set_wysiwyg_content(res.data.TermsAndConditions)
            setTimeout(() => {
               window.location.reload()
            }, 2000)
         })
         .catch(err => {
            set_state({ loading: false })
            set_state({ error: true })
         })
   }

   const deletePodcastChannel = async id => {
      const config = {
         headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}` },
      }

      await axios
         .delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-channels/${id}`, config)
         .then(async res => {
            set_state({ loading: false })
            set_state({ success: true })
            setTimeout(() => {
               window.location.reload()
            }, 2000)
         })
         .catch(res => {
            set_state({ loading: false })
            set_state({ error: true })
         })
   }

   function getAllDatas(data) {
      set_old_author_category(data.book_authors)
      set_old_book_category(data.book_categories)
      set_old_podcast_category(data.podcast_categories)

      let blocksFromHTML = convertFromHTML(data.termsAndConditions)
      let htmlData = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
      set_wysiwyg_content(EditorState.createWithContent(htmlData))
      setTermsData(true)

      getCategoriesInfo(data.podcast_categories)
   }

   async function fetchData() {
      await axios({
         url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/settings-page`,
         method: "GET",
         headers: { Authorization: `${JSON.parse(localStorage.getItem("user_information")).jwt}` },
      })
         .then(res => {
            console.log("res.data 1")
            console.log(res.data)
            // setIsNetworkLoading(false)
            // setIsNetworkingError(false)
            getAllDatas(res.data)
         })
         .catch(err => {
            console.log(err)
            console.log("err 1")
            setIsNetworkLoading(false)
            setIsNetworkingError(true)
         })
   }

   async function fetchAdmins() {
      await axios({
         url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/all-admins-settings`,
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(res => {
            console.log("res.data2")
            console.log(res.data)
            set_all_admins(res.data)
            // setIsNetworkLoading(false)
            // setIsNetworkingError(false)
         })
         .catch(err => {
            console.log("err2")
            setIsNetworkLoading(false)
            setIsNetworkingError(true)
         })
   }

   async function fetchAllBooks() {
      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books`,
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(res => {
            console.log("res.data3")
            console.log(res.data)
            set_all_books(res.data)
            // setIsNetworkLoading(false)
            // setIsNetworkingError(false)
         })
         .catch(err => {
            console.log("err3")
            setIsNetworkLoading(false)
            setIsNetworkingError(true)
         })
   }

   async function fetchAllChannels() {
      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-channels`,
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(res => {
            console.log("res.data4")
            console.log(res.data)
            // setIsNetworkLoading(false)
            // setIsNetworkingError(false)
            set_all_channels(res.data)
         })
         .catch(err => {
            console.log("err4")
            setIsNetworkLoading(false)
            setIsNetworkingError(true)
         })
   }

   const getCategoriesInfo = categories => {
      const a = categories.map(category => {
         return {
            label: category.label,
            value: category.value,
         }
      })
      set_podcast_category(a)
   }

   function handleMulti_author(selected_categories) {
      setSelectedMulti_category(selected_categories)
   }

   useEffect(() => {
      console.log("effect")
      fetchData()
      fetchAdmins()
      fetchAllBooks()
      fetchAllChannels()
      setIsNetworkLoading(false)
   }, [])

   // zurag solih
   const imageHandler = e => {
      const reader = new FileReader()
      reader.onload = () => {
         if (reader.readyState === 2) {
            set_podcast_pic(reader.result)
         }
      }
      reader.readAsDataURL(e.target.files[0])
      set_channel_cover_pic(e.target.files[0])
   }

   return (
      <React.Fragment>
         {isNetworkingError ? (
            <Alert color="danger" role="alert" className="w-100 text-center">
               Сүлжээ уналаа ! Дахин ачааллна уу ?
            </Alert>
         ) : (
            <React.Fragment>
               {isNetworkLoading ? (
                  <Row>
                     <Col xs="12">
                        <div className="text-center my-3">
                           <Link to="#" className="text-success">
                              <i className="bx bx-hourglass bx-spin mr-2" />
                              Ачааллаж байна
                           </Link>
                        </div>
                     </Col>
                  </Row>
               ) : (
                  <Row>
                     <Col lg={12}>
                        <Card>
                           <CardBody>
                              <CardTitle>Үйлчилгээний нөхцөл</CardTitle>
                              {termsData ? (
                                 <Editor
                                    onEditorStateChange={e => {
                                       set_wysiwyg_content(e)
                                    }}
                                    defaultEditorState={wysiwyg_content}
                                    toolbarOnFocus
                                    toolbar={{
                                       options: ["blockType", "fontSize", "list", "textAlign", "embedded", "emoji", "history"],
                                    }}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                 />
                              ) : null}
                           </CardBody>
                           <CardBody></CardBody>
                        </Card>
                     </Col>

                     <Col lg={12} className="text-right mb-3">
                        <Button
                           className="btn btn-success text-dark"
                           color="success"
                           onClick={() => {
                              set_confirm_terms(true)
                           }}
                        >
                           Хадгалах
                        </Button>
                     </Col>

                     <Col lg={6}>
                        <Card>
                           <CardTitle className="p-3">Номын зохиолчид</CardTitle>
                           <CardBody>
                              <Row>
                                 <Col lg={12} className="w-100 mx-auto mb-3">
                                    <p>Зохиолч сонгох</p>
                                    <select
                                       className="form-control"
                                       id="bookAuthorsCategory"
                                       onChange={e => {
                                          set_author_category_id(e.target.value)
                                       }}
                                    >
                                       <option selected defaultValue hidden value={null}>
                                          --Сонгох--
                                       </option>
                                       {old_author_category.length != 0
                                          ? old_author_category.map((author, index) => (
                                               <option key={index} value={author.value}>
                                                  {author.label}
                                               </option>
                                            ))
                                          : null}
                                    </select>
                                 </Col>
                                 <Col lg={12} className="mb-2">
                                    <Label>Зохиолч нэмэх</Label>
                                    <Row>
                                       <Col lg={10}>
                                          <input className="form-control mt-1" type="text" placeholder="Зохиогч оруулах" onChange={e => set_new_author_category(e.target.value)} />
                                       </Col>
                                       <Col lg={2}>
                                          <Button
                                             to="#"
                                             color="light"
                                             className="mt-1 py-2 px-3 border border-light"
                                             onClick={() => {
                                                if (new_author_category != "") {
                                                   set_confirm_add_author(true)
                                                }
                                             }}
                                          >
                                             Нэмэх
                                          </Button>
                                       </Col>
                                    </Row>
                                 </Col>
                                 <Col lg={12}>
                                    <Label>Сонгосон зохиолч</Label>
                                    <Row>
                                       <Col lg={10}>
                                          <Label className="form-control mt-1">{author_category_id != null ? old_author_category.find(author => author.value == author_category_id).label : null}</Label>
                                       </Col>
                                       <Col lg={2}>
                                          <Button
                                             to="#"
                                             color="light"
                                             className="mt-1 py-2 px-3 border border-light"
                                             onClick={() => {
                                                if (author_category_id != null) {
                                                   set_confirm_remove_author(true)
                                                }
                                             }}
                                          >
                                             Хасах
                                          </Button>
                                       </Col>
                                    </Row>
                                 </Col>
                              </Row>
                           </CardBody>
                        </Card>
                     </Col>

                     <Col lg={6}>
                        <Card>
                           <CardTitle className="p-3">Номын категориуд</CardTitle>
                           <CardBody>
                              <Row>
                                 <Col lg={12} className="w-100 mx-auto mb-3">
                                    <p>Категори сонгох</p>
                                    <select className="form-control" id="bookCategory" onChange={e => set_book_category_id(e.target.value)}>
                                       <option selected defaultValue hidden value={null}>
                                          --Сонгох--
                                       </option>
                                       {old_book_category.length != 0
                                          ? old_book_category.map((book, index) => {
                                               return (
                                                  <option key={index} value={book.value}>
                                                     {book.label}
                                                  </option>
                                               )
                                            })
                                          : null}
                                    </select>
                                 </Col>

                                 <Col className="mb-2" lg={12}>
                                    <Label>Төрөл нэмэх</Label>
                                    <Row>
                                       <Col lg={10}>
                                          <input className="form-control mt-1" type="text" placeholder="Төрөл оруулах" onChange={e => set_new_book_category(e.target.value)} />
                                       </Col>
                                       <Col lg={2}>
                                          <Button
                                             to="#"
                                             color="light"
                                             className="mt-1 py-2 px-3 border border-light"
                                             onClick={() => {
                                                if (new_book_category != "") {
                                                   set_confirm_add_book_category(true)
                                                }
                                             }}
                                          >
                                             Нэмэх
                                          </Button>
                                       </Col>
                                    </Row>
                                 </Col>
                                 <Col lg={12}>
                                    <Label>Сонгосон категори</Label>
                                    <Row>
                                       <Col lg={10}>
                                          <Label className="form-control mt-1">{book_category_id != null ? old_book_category.find(category => category.value == book_category_id).label : null}</Label>
                                       </Col>
                                       <Col lg={2}>
                                          <Button
                                             to="#"
                                             color="light"
                                             className="mt-1 py-2 px-3 border border-light"
                                             onClick={() => {
                                                if (book_category_id != null) {
                                                   set_confirm_remove_book_category(true)
                                                }
                                             }}
                                          >
                                             Хасах
                                          </Button>
                                       </Col>
                                    </Row>
                                 </Col>
                              </Row>
                           </CardBody>
                        </Card>
                     </Col>

                     <Col lg={6}>
                        <Card>
                           <CardTitle className="p-3">Подкастын категориуд</CardTitle>
                           <CardBody>
                              <Row>
                                 <Col lg={12} className="w-100 mx-auto mb-3">
                                    <p>Категори сонгох</p>
                                    <select
                                       className="form-control"
                                       id="podcastCategory"
                                       onChange={e => {
                                          set_podcast_category_id(e.target.value)
                                       }}
                                    >
                                       <option selected defaultValue hidden value={null}>
                                          --Сонгох--
                                       </option>

                                       {old_podcast_category.length != 0
                                          ? old_podcast_category.map((podcast, index) => (
                                               <option key={index} value={podcast.value}>
                                                  {podcast.label}
                                               </option>
                                            ))
                                          : null}
                                    </select>
                                 </Col>

                                 <Col className="mb-2" lg={12}>
                                    <Label>Төрөл нэмэх</Label>
                                    <Row>
                                       <Col lg={10}>
                                          <input className="form-control mt-1" type="text" placeholder="Төрөл оруулах" onChange={e => set_new_podcast_category(e.target.value)} />
                                       </Col>
                                       <Col lg={2}>
                                          <Button
                                             to="#"
                                             color="light"
                                             className="mt-1 py-2 px-3 border border-light"
                                             onClick={() => {
                                                if (new_podcast_category != "") {
                                                   set_confirm_add_podcast_category(true)
                                                }
                                             }}
                                          >
                                             Нэмэх
                                          </Button>
                                       </Col>
                                    </Row>
                                 </Col>
                                 <Col lg={12}>
                                    <Label>Сонгосон категори</Label>
                                    <Row>
                                       <Col lg={10}>
                                          <Label className="form-control mt-1">{podcast_category_id != null ? old_podcast_category.find(category => category.value == podcast_category_id).label : null}</Label>
                                       </Col>
                                       <Col lg={2}>
                                          <Button
                                             to="#"
                                             color="light"
                                             className="mt-1 py-2 px-3 border border-light"
                                             onClick={() => {
                                                if (podcast_category_id != null) {
                                                   set_confirm_remove_podcast_category(true)
                                                }
                                             }}
                                          >
                                             Хасах
                                          </Button>
                                       </Col>
                                    </Row>
                                 </Col>
                              </Row>
                           </CardBody>
                        </Card>
                        <Row>
                           <Col lg={12}>
                              <Card>
                                 <CardTitle className="p-3">Онцгой ном хадгалах</CardTitle>
                                 <CardBody>
                                    <Row>
                                       <Col lg={9} className="">
                                          <select className="form-control" id="allBooks" onChange={e => set_special_book_id(e.target.value)}>
                                             <option selected defaultValue hidden value={null}>
                                                --Сонгох--
                                             </option>
                                             {all_books.length != 0
                                                ? all_books.map((book, index) => (
                                                     <option key={index} value={book.id}>
                                                        {book.name}
                                                     </option>
                                                  ))
                                                : null}
                                          </select>
                                       </Col>
                                       <Col lg={2}>
                                          <Button
                                             className="btn btn-info text-dark"
                                             onClick={() => {
                                                if (special_book_id != null) {
                                                   set_confirm_save_book(true)
                                                }
                                             }}
                                          >
                                             Хадгалах
                                          </Button>
                                       </Col>
                                    </Row>
                                 </CardBody>
                              </Card>
                           </Col>
                           <BlogCategoryCrud />
                        </Row>
                     </Col>

                     <Col lg={6}>
                        <Card>
                           <CardTitle className="p-3">Подкаст суваг нэмэх</CardTitle>
                           <CardBody>
                              <Row className="mb-3">
                                 <Col lg={6}>
                                    <p>Сувгийн нэр</p>
                                    <input
                                       className="form-control"
                                       type="text"
                                       placeholder="Нэр оруулах"
                                       onChange={e => {
                                          set_channel_name(e.target.value)
                                       }}
                                    />
                                 </Col>
                                 <Col lg={6}>
                                    <p>Нийтлэгч</p>
                                    <select
                                       className="form-control"
                                       id="allAdmins"
                                       onChange={e => {
                                          set_admin_selected(e.target.value)
                                       }}
                                    >
                                       <option selected defaultValue hidden value={null}>
                                          --Сонгох--
                                       </option>
                                       {all_admins.length != 0
                                          ? all_admins.map((admin, index) => (
                                               <option key={index} value={admin.id}>
                                                  {admin.username}
                                               </option>
                                            ))
                                          : null}
                                    </select>
                                 </Col>
                                 <Col lg={12} className="mt-3">
                                    <p>Категори сонгох</p>
                                    <Select
                                       value={selectedMulti_category}
                                       isMulti={true}
                                       placeholder="Сонгох ... "
                                       onChange={e => {
                                          handleMulti_author(e)
                                       }}
                                       options={podcast_category}
                                       classNamePrefix="select2-selection"
                                    />
                                 </Col>
                              </Row>
                              <Row className="mb-3">
                                 <Col lg={7} className="mt-2">
                                    <p>Тайлбар</p>
                                    <textarea rows="3" className="form-control" onChange={e => set_channel_desc(e.target.value)}></textarea>
                                 </Col>

                                 <Col lg={5}>
                                    <p className="m-0 p-0">Зураг</p>
                                    <img className="rounded" alt="" id="img" className="img-fluid" src={podcast_pic} />
                                    <input type="file" id="input" accept="image/*" className="invisible" onChange={imageHandler} />
                                    <div className="label">
                                       <label htmlFor="input" className="image-upload d-flex justify-content-center" style={{ cursor: "pointer" }}>
                                          <i className="bx bx-image-add font-size-20 mr-2"></i>
                                          <p>Зураг оруулах</p>
                                       </label>
                                    </div>
                                 </Col>
                              </Row>
                              <Row>
                                 <Col lg={10}></Col>
                                 <Col lg={2}>
                                    <Button
                                       onClick={() => {
                                          if (channel_cover_pic != null && admin_selected != null) set_confirm_add_podcast_channel(true)
                                       }}
                                       className="btn btn-success text-dark"
                                    >
                                       Нэмэх
                                    </Button>
                                 </Col>
                              </Row>
                           </CardBody>
                        </Card>
                        <Row>
                           <Col lg={12}>
                              <Card>
                                 <CardTitle className="p-3">Подкаст суваг устгах</CardTitle>
                                 <CardBody>
                                    <Row>
                                       <Col lg={9} className="">
                                          <select className="form-control" id="allChannels" onChange={e => set_insert_channels_id(e.target.value)}>
                                             <option selected defaultValue hidden value={null}>
                                                --Сонгох--
                                             </option>
                                             {all_channels.length != 0
                                                ? all_channels.map(channel => (
                                                     <option key={channel.id} value={channel.id}>
                                                        {channel.name}
                                                     </option>
                                                  ))
                                                : null}
                                          </select>
                                       </Col>
                                       <Col lg={2}>
                                          <Button
                                             className="btn btn-info"
                                             onClick={() => {
                                                if (insert_channels_id != null) {
                                                   set_confirm_delete_channel(true)
                                                }
                                             }}
                                          >
                                             Устгах
                                          </Button>
                                       </Col>
                                    </Row>
                                 </CardBody>
                              </Card>
                           </Col>
                        </Row>
                     </Col>
                  </Row>
               )}
            </React.Fragment>
         )}

         <Row>
            {confirm_terms ? (
               <SweetAlert
                  title="Үйлчилгээний нөхцөлөө өөрчлөх гэж байна"
                  info
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Буцах"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_state({ loading: true })
                     updateTerms()
                     set_confirm_terms(false)
                  }}
                  onCancel={() => {
                     set_confirm_terms(false)
                  }}
               ></SweetAlert>
            ) : null}
            {confirm_add_author ? (
               <SweetAlert
                  title="Зохиолч нэмэх"
                  info
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Буцах"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_state({ loading: true })
                     addBookAuthor()
                     set_confirm_add_author(false)
                  }}
                  onCancel={() => {
                     set_confirm_add_author(false)
                  }}
               ></SweetAlert>
            ) : null}
            {confirm_remove_author ? (
               <SweetAlert
                  title="Зохиолч хасах"
                  info
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Буцах"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_confirm_remove_author(false)
                     set_state({ loading: true })
                     deleteBookAuthor(author_category_id)
                  }}
                  onCancel={() => {
                     set_confirm_remove_author(false)
                  }}
               ></SweetAlert>
            ) : null}
            {confirm_add_book_category ? (
               <SweetAlert
                  title="Категори нэмэх"
                  info
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Буцах"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_confirm_add_book_category(false)
                     set_state({ loading: true })
                     addBookCategory()
                  }}
                  onCancel={() => {
                     set_confirm_add_book_category(false)
                  }}
               ></SweetAlert>
            ) : null}
            {confirm_remove_book_category ? (
               <SweetAlert
                  title="Категори хасах "
                  info
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Буцах"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_confirm_remove_book_category(false)
                     set_state({ loading: true })
                     deleteBookCategory(book_category_id)
                  }}
                  onCancel={() => {
                     set_confirm_remove_book_category(false)
                  }}
               ></SweetAlert>
            ) : null}
            {confirm_add_podcast_category ? (
               <SweetAlert
                  title="Категори нэмэх"
                  info
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Буцах"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_confirm_add_podcast_category(false)
                     set_state({ loading: true })
                     addPodcastCategory()
                  }}
                  onCancel={() => {
                     set_confirm_add_podcast_category(false)
                  }}
               ></SweetAlert>
            ) : null}
            {confirm_remove_podcast_category ? (
               <SweetAlert
                  title="Категори хасах"
                  info
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Буцах"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_confirm_remove_podcast_category(false)
                     set_state({ loading: true })
                     deletePodcastCategory(podcast_category_id)
                  }}
                  onCancel={() => {
                     set_confirm_remove_podcast_category(false)
                  }}
               ></SweetAlert>
            ) : null}
            {confirm_add_podcast_channel ? (
               <SweetAlert
                  title="Подкаст суваг нэмэх"
                  info
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Буцах"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_confirm_add_podcast_channel(false)
                     set_state({ loading: true })
                     createPodcastChannel()
                  }}
                  onCancel={() => {
                     set_confirm_add_podcast_channel(false)
                  }}
               ></SweetAlert>
            ) : null}
            {confirm_save_book ? (
               <SweetAlert
                  title="Онцгой ном хадгалах"
                  info
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Буцах"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_confirm_save_book(false)
                     set_state({ loading: true })
                     saveBook()
                  }}
                  onCancel={() => {
                     set_confirm_save_book(false)
                  }}
               ></SweetAlert>
            ) : null}

            {confirm_delete_channel ? (
               <SweetAlert
                  title="Подкаст суваг устгах"
                  info
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Буцах"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_confirm_delete_channel(false)
                     set_state({ loading: true })
                     deletePodcastChannel(insert_channels_id)
                  }}
                  onCancel={() => {
                     set_confirm_delete_channel(false)
                  }}
               ></SweetAlert>
            ) : null}
         </Row>
      </React.Fragment>
   )
}

export default SettingsForm
