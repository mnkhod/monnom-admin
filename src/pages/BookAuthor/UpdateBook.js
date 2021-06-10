import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Row, Col, Card, Label, Input, FormGroup, Modal, ModalHeader, ModalBody, TabContent, TabPane, NavItem, NavLink, Progress, Form } from "reactstrap"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import Dropzone from "react-dropzone"
import classnames from "classnames"
import Select from "react-select"
import { ResultPopUp } from "../../contexts/CheckActionsContext"

// file  generator
const getItems = files => {
   let tempArray = []
   Object.keys(files).map((key, index) => {
      tempArray.push({
         id: `item-${files[key].id != undefined ? index + files[key].id : index}`,
         content: files[key].name,
         book_id: files[key].id,
      })
   })
   return tempArray
}

// old file  generator
const getOldItems = files => {
   let tempArray = []
   Object.keys(files).map((key, index) => {
      tempArray.push({
         id: `item-${files[key].id != undefined ? index + files[key].id : index}`,
         content: files[key].chapter_name,
         book_id: files[key].id != undefined ? files[key].id : index,
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

const uploadReorder = (list, startIndex, endIndex) => {
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

const config = {
   "content-type": "multipart/form-data",
   Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
}

export default function UpdateBook(props) {
   const [state, set_state] = useContext(ResultPopUp)
   const [checking_state, set_checking_state] = useState(null)

   const [activeTab, set_activeTab] = useState(1)
   const [progressValue, setprogressValue] = useState(33)

   const [optionGroup_authors, set_optionGroup_authors] = useState([])
   const [optionGroup_categories, set_optionGroup_categories] = useState([])
   const [coverImage, setCoverImage] = useState(null)

   const [progress_mp3, set_progress_mp3] = useState(0)
   const [audio_book_files, set_audio_book_files] = useState([])
   const [next_button_label, set_next_button_label] = useState("Дараах")

   const [edit_has_sale, set_edit_has_sale] = useState(false)
   const [edit_has_mp3, set_edit_has_mp3] = useState(false)
   const [edit_has_pdf, set_edit_has_pdf] = useState(false)
   const [edit_book_id, set_edit_book_id] = useState(null)
   const [edit_reference_id, set_edit_reference_id] = useState(null)
   const [check_field, set_check_field] = useState("")

   const [check_update_field, set_check_update_field] = useState({
      name: false,
      intro: false,
      picture: false,
      audio_file: false,
      remove_audio_file: false,
      pdf_file: false,
      remove_pdf_file: false,
      reference: false,
      remove_reference: false,
      book_price: false,
      ebook_price: false,
      audio_price: false,
      youtube_url: false,
      authors: false,
      categories: false,
      change_position: false,
   })

   // update, delete hiih state uud
   const [edit_book_name, set_edit_book_name] = useState("")
   const [send_cover_pic, set_send_cover_pic] = useState(null)
   const [selectedMulti_author, setselectedMulti_author] = useState([])
   const [selectedMulti_category, setselectedMulti_category] = useState([])
   const [referenceFiles, set_referenceFiles] = useState([])
   const [book_comments_pic, set_book_comments_pic] = useState([])
   const [book_price, set_book_price] = useState(0)
   const [ebook_price, set_ebook_price] = useState(0)
   const [sale_book_price, set_sale_book_price] = useState(0)
   const [audio_book_price, set_audio_book_price] = useState(0)
   const [youtube_url, set_youtube_url] = useState("")
   const [book_introduction, set_book_introduction] = useState("")
   const [book_files, set_book_files] = useState([])
   const [audio_book_files_for_delete, set_audio_book_files_for_delete] = useState([])
   const [audio_book_files_for_save, set_audio_book_files_for_save] = useState([])

   const getAudioFileDuration = file =>
      new Promise((resolve, reject) => {
         let reader = new FileReader()

         reader.onload = function (event) {
            let audioContext = new (window.AudioContext || window.webkitAudioContext)()
            audioContext.decodeAudioData(event.target.result).then(buffer => {
               let duration = buffer.duration

               resolve(duration)
            })
         }
         reader.readAsArrayBuffer(file)
      })

   const sendNotIncludedFilesUpdate = async (categories, authors) => {
      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${props.book_id}`,
         method: "PUT",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
         data: {
            name: edit_book_name,
            introduction: book_introduction,
            youtube_url: youtube_url,
            book_price: book_price,
            online_book_price: ebook_price,
            audio_book_price: audio_book_price,
            book_categories: categories,
            book_authors: authors,
            has_audio: edit_has_mp3,
            has_pdf: edit_has_pdf,
         },
      })
         .then(async res => {
            console.log("pisda")
            set_checking_state(true)
         })
         .catch(e => {
            console.log("pisda 1")
            set_checking_state(false)
         })
   }

   const updateCoverPic = async () => {
      let coverPicture = new FormData()
      coverPicture.append("data", JSON.stringify({}))
      coverPicture.append("files.picture", send_cover_pic, send_cover_pic.name)

      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${props.book_id}`,
         method: "PUT",
         headers: config,
         data: coverPicture,
      })
         .then(res => {
            set_checking_state(true)
         })
         .catch(e => {
            set_checking_state(false)
         })
   }

   const updateAudios = async () => {
      let tempAudioRequests = []
      let promises = []

      const conf = {
         headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      audio_book_files_for_save.forEach((file, index) => {
         promises.push(
            getAudioFileDuration(audio_book_files_for_save[index])
               .then(res => {
                  let audio_duration = res
                  let tempFormData = new FormData()
                  let data = {
                     chapter_name: audio_book_files_for_save[index].name.split(".").slice(0, -1).join("."),
                     book: props.book_id,
                     number: index,
                     audio_duration: audio_duration.toString(),
                  }
                  tempFormData.append("data", JSON.stringify(data))
                  tempFormData.append("files.mp3_file", audio_book_files_for_save[index], audio_book_files_for_save[index].name)
                  tempAudioRequests.push({
                     url: `${process.env.REACT_APP_STRAPI_BASE_URL}/book-audios`,
                     formData: tempFormData,
                  })
               })

               .catch(err => {
                  set_checking_state(false)
               })
         )
      })

      Promise.all(promises)
         .then(() => {
            axios
               .all(tempAudioRequests.map(tempRequest => axios.post(tempRequest.url, tempRequest.formData, conf)))
               .then(() => {
                  axios({
                     url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${props.book_id}`,
                     method: "PUT",
                     headers: config,
                     data: {
                        has_audio: audio_book_files.length != 0 ? true : false,
                        has_pdf: book_files.length != 0 ? true : false,
                     },
                  })
                     .then(res => {
                        set_checking_state(true)
                     })

                     .catch(err => {
                        set_checking_state(false)
                     })
               })
               .catch(err => {
                  set_checking_state(false)
               })
         })
         .catch(e => {
            set_checking_state(false)
         })
   }

   const updateAudioFilesStackNumber = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      let tempStackSequence = audio_book_files_for_save.map((file, index) => {
         return {
            id: file.id,
            index,
         }
      })

      console.log

      await axios
         .all(tempStackSequence.map(stack => axios.put(`${process.env.REACT_APP_STRAPI_BASE_URL}/book-audios/${stack.id}`, { stack_number: stack.index }, config)))
         .then(() => {
            set_checking_state(true)
         })
         .catch(err => {
            set_checking_state(false)
         })
   }

   const changePosition = async () => {
      console.log("audio_book_files_for_save")
      console.log(audio_book_files_for_save)
      audio_book_files_for_save.forEach(audio => {
         console.log("audio")
         console.log(audio)
      })

      let tempAudioRequests = []
      let promises = []

      const conf = {
         headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      audio_book_files_for_save.forEach((file, index) => {
         promises.push(
            getAudioFileDuration(audio_book_files_for_save[index])
               .then(res => {
                  let audio_duration = res
                  let tempFormData = new FormData()
                  let data = {
                     chapter_name: audio_book_files_for_save[index].name.split(".").slice(0, -1).join("."),
                     book: props.book_id,
                     number: index,
                     audio_duration: audio_duration.toString(),
                  }
                  tempFormData.append("data", JSON.stringify(data))
                  tempFormData.append("files.mp3_file", audio_book_files_for_save[index], audio_book_files_for_save[index].name)
                  tempAudioRequests.push({
                     url: `${process.env.REACT_APP_STRAPI_BASE_URL}/book-audios`,
                     formData: tempFormData,
                  })
               })

               .catch(err => {
                  set_checking_state(false)
               })
         )
      })

      Promise.all(promises)
         .then(() => {
            axios
               .all(tempAudioRequests.map(tempRequest => axios.post(tempRequest.url, tempRequest.formData, conf)))
               .then(() => {
                  axios({
                     url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${props.book_id}`,
                     method: "PUT",
                     config,
                     data: {
                        has_audio: audio_book_files.length != 0 ? true : false,
                        has_pdf: book_files.length != 0 ? true : false,
                     },
                  })
                     .then(res => {
                        set_checking_state(true)
                     })

                     .catch(err => {
                        set_checking_state(false)
                     })
               })
               .catch(err => {
                  set_checking_state(false)
               })
         })
         .catch(e => {
            set_checking_state(false)
         })
   }

   const updatePDF = async () => {
      let ebookFile = new FormData()
      ebookFile.append(
         "data",
         JSON.stringify({
            has_audio: audio_book_files.length != 0 ? true : false,
            has_pdf: book_files.length != 0 ? true : false,
         })
      )
      ebookFile.append("files.pdf_book_path", book_files[0], book_files[0].name)

      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${props.book_id}`,
         method: "PUT",
         headers: config,
         data: ebookFile,
      })
         .then(res => {
            set_checking_state(true)
         })
         .catch(e => {
            set_checking_state(false)
         })
   }

   const removePDF = async () => {
      console.log("removePDF")
      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${props.book_id}`,
         method: "PUT",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
         data: {
            pdf_book_path: null,
            has_pdf: false,
         },
      })
         .then(res => {
            set_checking_state(true)
         })
         .catch(err => {
            console.log(err)
            set_checking_state(false)
         })
   }

   const updatePictureComment = async () => {
      const bookComments = new FormData()
      bookComments.append("data", JSON.stringify({}))

      for (let i = 0; i < referenceFiles.length; i++) {
         bookComments.append("files.picture_comment", referenceFiles[i], referenceFiles[i].name)
      }

      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${props.book_id}`,
         method: "PUT",
         config,
         data: bookComments,
      })
         .then(res => {
            set_checking_state(true)
         })
         .catch(e => {
            set_checking_state(false)
         })
   }

   const removeReference = async () => {
      const delete_req = new FormData()
      delete_req.append("data", JSON.stringify({}))

      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${props.book_id}`,
         method: "PUT",
         config,
         data: {},
      })
         .then(res => {
            set_checking_state(true)
         })
         .catch(err => {
            set_checking_state(false)
         })
   }

   const deleteChapters = async () => {
      let delete_requests = audio_book_files_for_delete.map(id => `${process.env.REACT_APP_STRAPI_BASE_URL}/book-audios/${id}`)

      await axios
         .all(delete_requests.map(request_url => axios.delete(request_url, config)))
         .then((...res) => {
            axios({
               url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${props.book_id}`,
               method: "PUT",
               config,
               data: {
                  pdf_book_path: [],
                  has_audio: audio_book_files.length != 0 ? true : false,
                  has_pdf: book_files.length != 0 ? true : false,
               },
            })
               .then(res => {
                  set_checking_state(true)
               })
               .catch(err => {
                  set_checking_state(false)
               })
         })
         .catch(err => {
            set_checking_state(false)
         })
   }

   const updateBook = async () => {
      let categories = selectedMulti_category.map(category => category.value.toString())
      let authors = selectedMulti_author.map(author => author.value.toString())

      // check if nothing changed
      let flag = false
      for (const [key, value] of Object.entries(check_update_field)) if (value) flag = true

      if (!flag) {
         set_state({ loading: false })
      } else {
         if (check_update_field.name || check_update_field.intro || check_update_field.youtube_url || check_update_field.book_price || check_update_field.ebook_price || check_update_field.audio_price || check_update_field.authors || check_update_field.categories) {
            sendNotIncludedFilesUpdate(categories, authors)
         }

         if (check_update_field.picture) {
            updateCoverPic()
         }

         if (check_update_field.audio_file) {
            updateAudios()
         }

         if (check_update_field.remove_audio_file) {
            deleteChapters()
         }

         if (check_update_field.pdf_file) {
            updatePDF()
         }

         if (check_update_field.remove_pdf_file) {
            removePDF()
         }

         if (check_update_field.reference) {
            updatePictureComment()
         }

         if (check_update_field.remove_reference) {
            removeReference()
         }

         if (check_update_field.change_position) {
            updateAudioFilesStackNumber()
            // await changePosition()
         }

         // console.log("checking_state")
         // console.log(checking_state)
      }
   }

   useEffect(() => {
      console.log(checking_state)
      if (checking_state != null)
         if (checking_state) {
            set_state({ loading: false })
            set_state({ success: true })
         } else {
            set_state({ loading: false })
            set_state({ error: true })
         }
   }, [checking_state])

   const fetchBookData = () => {
      axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${props.book_id}`,
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(res => {
            set_edit_book_name(res.data.name)
            {
               res.data.pdf_book_path != null ? set_edit_has_pdf(true) : set_edit_has_pdf(false)
            }
            {
               res.data.book_audios.length != 0 ? set_edit_has_mp3(true) : set_edit_has_mp3(false)
            }
            set_edit_has_pdf(res.data.has_pdf)
            set_edit_has_mp3(res.data.has_audio)
            set_edit_has_sale(res.data.has_sale)
            setCoverImage(`${res.data.picture.url}`)
            set_send_cover_pic(`${res.data.picture.url}`)
            getAuthorsInfo(res.data.book_authors)
            getCategoryInfo(res.data.book_categories)
            set_sale_book_price(res.data.book_price)
            set_audio_book_price(res.data.audio_book_price)
            set_ebook_price(res.data.online_book_price)
            set_youtube_url(res.data.youtube_intro)
            set_book_introduction(res.data.introduction)
            {
               res.data.pdf_book_path != null && set_book_files([res.data.pdf_book_path])
            }
            let sortedList = res.data.book_audios.sort((a, b) => a.id - b.id)
            set_audio_book_files(getOldItems(sortedList))
            set_audio_book_files_for_save(sortedList)
            set_book_comments_pic(res.data.picture_comment)

            console.log("sort")
            console.log(res.data.book_audios.sort((a, b) => a.number - b.number))
         })
         .catch(err => {})
   }

   useEffect(() => {
      fetchBookData()
   }, [props.book_id])

   // multiple book authors selected
   function handleMulti_book_author(selectedMulti) {
      if (!check_update_field.authors) set_check_update_field({ ...check_update_field, authors: true })
      setselectedMulti_author(selectedMulti)
   }

   function handleMulti_book_category(selectedMulti) {
      if (!check_update_field.categories) set_check_update_field({ ...check_update_field, categories: true })
      setselectedMulti_category(selectedMulti)
   }

   // props oos irsen nomnii categoruudiig awah
   const getAuthorsInfo = authors => {
      const allBookAuthors = props.authors.map(author => {
         return {
            label: author.author_name,
            value: author.id,
         }
      })

      const oldBookAuthors = authors.map(author => {
         return {
            label: author.author_name,
            value: author.id,
         }
      })
      setselectedMulti_author(oldBookAuthors)
      set_optionGroup_authors(allBookAuthors)
   }

   const getCategoryInfo = categories => {
      const allBookCategories = props.categories.map(category => {
         return {
            label: category.name,
            value: category.id,
         }
      })

      const oldBookCategories = categories.map(category => {
         return {
            label: category.name,
            value: category.id,
         }
      })
      set_optionGroup_categories(allBookCategories)
      setselectedMulti_category(oldBookCategories)
   }

   // nomiin zurag solih
   const imageHandler = e => {
      const reader = new FileReader()
      reader.onload = () => {
         if (reader.readyState === 2) {
            setCoverImage(reader.result)
         }
      }
      if (!check_update_field.picture) {
         set_check_update_field({ ...check_update_field, picture: true })
      }
      reader.readAsDataURL(e.target.files[0])
      set_send_cover_pic(e.target.files[0])
   }

   const togglemodal = () => {
      props.setModal(!props.modal)
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
               set_next_button_label("Дараах")
            }
            if (tab === 3) {
               setprogressValue(100)
               set_next_button_label("Хадгалах")
            }
         }
      }
   }

   // upload hiisen file uudiin zooh, indexuudiig zaaj ogoh
   const onDragEnd = result => {
      // dropped outside the list
      if (!result.destination) {
         return
      }

      const items = reorder(audio_book_files, result.source.index, result.destination.index)
      const uploadItems = uploadReorder(audio_book_files_for_save, result.source.index, result.destination.index)

      set_audio_book_files(items)
      set_audio_book_files_for_save(uploadItems)

      set_check_update_field({ ...check_update_field, change_position: true })
   }

   // pdf file upload hiih
   const uploadBook = e => {
      var files = e.target.files
      if (!check_update_field.pdf_file) set_check_update_field({ ...check_update_field, pdf_file: true })
      set_book_files([files[0]])
   }

   // upload hiisen pdf file aa ustgah
   const removeBookFiles = f => {
      set_edit_book_id(book_files[0].id)
      set_book_files(book_files.filter(book => book == f))

      if (!check_update_field.remove_pdf_files) {
         set_check_update_field({ ...check_update_field, remove_pdf_file: true })
      }
   }

   // mp3 file upload hiih, nemeh
   const uploadAudioBook = e => {
      let files = e.target.files

      let tempfiles = []
      for (let i = 0; i < files.length; i++) {
         tempfiles.push(files[i])
      }

      if (!check_update_field.audio_file) set_check_update_field({ ...check_update_field, audio_file: true })
      set_audio_book_files_for_save(tempfiles)

      let newAudioBook = getItems(tempfiles)
      newAudioBook.filter(function (item) {
         return !audio_book_files.includes(item)
      })

      audio_book_files.forEach(audio => newAudioBook.unshift(audio))
      set_audio_book_files(newAudioBook)
   }

   // upload hiij bga mp3 file aa ustgah
   const removeAudioBookFiles = f => {
      set_audio_book_files_for_delete(prevState => [...audio_book_files_for_delete, f.book_id])
      set_audio_book_files(audio_book_files.filter(x => x !== f))
      set_audio_book_files_for_save(Array.from(audio_book_files_for_save).filter(file => file.name != f.content))
      if (!check_update_field.remove_audio_file) {
         set_check_update_field({ ...check_update_field, remove_audio_file: true })
      }
   }

   // ishlel upload hiih
   const handleAcceptedFiles = files => {
      files.map(file =>
         Object.assign(file, {
            preview: URL.createObjectURL(file),
            formattedSize: formatBytes(file.size),
         })
      )
      if (!check_update_field.reference) {
         set_check_update_field({ ...check_update_field, reference: true })
      }
      set_referenceFiles(files)
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

   const removeRef = id => {
      let remove_file = referenceFiles.filter(ref => {
         ref.id != edit_reference_id
      })
      set_referenceFiles(remove_file)
   }

   return (
      <>
         {props.modal ? (
            <Card>
               <Modal isOpen={props.modal} role="dialog" size="lg" autoFocus={true} centered={true} id="verificationModal" tabIndex="-1" toggle={togglemodal}>
                  <div className="modal-content">
                     <ModalHeader toggle={togglemodal}>Ном засварлах</ModalHeader>
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
                                    <p className="my-auto">Файл</p>
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
                                    <p className="my-auto">{book_comments_pic.length == 0 ? `Ишлэл` : `Бататгах`}</p>
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
                                             <Label for="kycfirstname-input">Номын нэр</Label>
                                             <Input
                                                type="text"
                                                value={edit_book_name}
                                                onChange={event => {
                                                   if (!check_update_field.name)
                                                      set_check_update_field({
                                                         ...check_update_field,
                                                         name: true,
                                                      })
                                                   set_edit_book_name(event.target.value)
                                                }}
                                             />
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
                                                         handleMulti_book_category(e)
                                                      }}
                                                      options={optionGroup_categories}
                                                      classNamePrefix="select2-selection"
                                                   />
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
                                                         handleMulti_book_author(e)
                                                      }}
                                                      options={optionGroup_authors}
                                                      classNamePrefix="select2-selection"
                                                   />
                                                </FormGroup>
                                             </Col>
                                          </Row>
                                       </Col>

                                       <Col lg={6}>
                                          <FormGroup className="mx-auto" style={{ width: "85%" }}>
                                             <Label htmlFor="productdesc">Зураг</Label>
                                             <img className="rounded" src={coverImage} alt={edit_book_name} id="img" className="img-fluid" style={{ width: "100%", height: "30vh" }} />
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
                                       <Col lg={6}>
                                          <FormGroup>
                                             <Label for="kycfirstname-input">Юү түүб хаяг</Label>
                                             <Input
                                                type="text"
                                                required
                                                value={youtube_url}
                                                onChange={e => {
                                                   if (!check_update_field.youtube_url)
                                                      set_check_update_field({
                                                         ...check_update_field,
                                                         youtube_url: true,
                                                      })
                                                   set_youtube_url(e.target.value)
                                                }}
                                             />
                                          </FormGroup>
                                          <Row>
                                             <Col lg={12}>
                                                {edit_has_sale ? (
                                                   <>
                                                      <Label>Хэвлэмэл номын үнэ</Label>
                                                      <Input
                                                         type="number"
                                                         value={sale_book_price}
                                                         onChange={e => {
                                                            if (!check_update_field)
                                                               set_check_update_field({
                                                                  ...check_update_field,
                                                                  book_price: true,
                                                               })
                                                            set_sale_book_price(e.target.value)
                                                         }}
                                                      />
                                                   </>
                                                ) : (
                                                   false
                                                )}
                                             </Col>
                                          </Row>
                                       </Col>
                                       <Col lg={6}>
                                          <FormGroup>
                                             <Label htmlFor="productdesc">Танилцуулга</Label>
                                             <textarea
                                                className="form-control"
                                                id="productdesc"
                                                rows="5"
                                                value={book_introduction}
                                                onChange={e => {
                                                   if (!check_update_field.intro)
                                                      set_check_update_field({
                                                         ...check_update_field,
                                                         intro: true,
                                                      })
                                                   set_book_introduction(e.target.value)
                                                }}
                                             />
                                          </FormGroup>
                                       </Col>
                                       <Col lg={12}>
                                          <p className="text-danger">{check_field}</p>
                                       </Col>
                                    </Row>
                                 </Form>
                              </TabPane>

                              <TabPane tabId={2} id="doc-verification">
                                 <Row className="mb-2">
                                    <Col lg={6}>
                                       {book_files.length != 0 ? (
                                          <FormGroup>
                                             <Label>Цахим номын үнэ</Label>
                                              
                                             <Input
                                                type="number"
                                                value={ebook_price}
                                                onChange={e => {
                                                   if (!check_update_field.ebook_price)
                                                      set_check_update_field({
                                                         ...check_update_field,
                                                         ebook_price: true,
                                                      })
                                                   set_ebook_price(e.target.value)
                                                }}
                                             />
                                          </FormGroup>
                                       ) : (
                                          []
                                       )}
                                    </Col>

                                    <Col lg={6}>
                                       {audio_book_files.length != 0 ? (
                                          <FormGroup>
                                             <Label>Аудио номын үнэ</Label>
                                              
                                             <Input
                                                type="number"
                                                value={audio_book_price}
                                                onChange={e => {
                                                   if (!check_update_field.audio_price)
                                                      set_check_update_field({
                                                         ...check_update_field,
                                                         audio_price: true,
                                                      })
                                                   set_audio_book_price(e.target.value)
                                                }}
                                             />
                                          </FormGroup>
                                       ) : (
                                          []
                                       )}
                                    </Col>
                                 </Row>

                                 <Row style={{ borderBottom: "1px solid #1f3bcc" }}>
                                    <>
                                       <Col xl={8} gl={8} xs={8}>
                                          {book_files.length != 0 && (
                                             <>
                                                <div className="d-flex justify-content-between bg-light border  rounded py-2 px-3 mb-3 align-items-center" style={{ width: "450px", marginLeft: "10px" }}>
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
                                                      {book_files[0].name != undefined && book_files[0].name}{" "}
                                                   </p>
                                                   <i
                                                      className="dripicons-cross font-size-20 my-auto text-dark"
                                                      onClick={removeBookFiles.bind(this, book_files)}
                                                      style={{
                                                         cursor: "pointer",
                                                         margin: "auto",
                                                         marginRight: "0",
                                                      }}
                                                   />
                                                </div>

                                                {progress_mp3 > 0 ? (
                                                   <div className="progress mt-2 w-60 mx-auto">
                                                      <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow={progress_mp3} aria-valuemin="0" aria-valuemax="100" style={{ width: progress_mp3 + "%" }}>
                                                         {progress_mp3}%
                                                      </div>
                                                   </div>
                                                ) : null}
                                             </>
                                          )}
                                       </Col>

                                       <Col xl={4} gl={4} xs={4} className="mb-2" style={{ borderLeft: "1px solid #000" }}>
                                          <label className="custom-file-upload d-flex">
                                             <input
                                                type="file"
                                                accept=".pdf,.epub"
                                                style={{
                                                   display: "none",
                                                }}
                                                onChange={e => uploadBook(e)}
                                             />
                                             <i
                                                className="font-size-15 btn btn-danger text-dark btn-rounded py-2 px-3"
                                                style={{
                                                   cursor: "pointer",
                                                }}
                                             >
                                                pdf ном
                                             </i>
                                          </label>
                                       </Col>
                                    </>
                                 </Row>
                                 <Row style={{ borderTop: "1px solid #1f3bcc" }}>
                                    <>
                                       <Col xl={8} gl={8} xs={8} style={{ paddingTop: "20px" }}>
                                          {audio_book_files.length != 0 && (
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
                                                                        {item.content.length > 50 ? `${item.content.slice(0, 50)}...` : item.content}{" "}
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
                                          )}
                                       </Col>

                                       <Col xl={4} gl={4} xs={4} className="mt-2" style={{ borderLeft: "1px solid #000" }}>
                                          <label className="custom-file-upload">
                                             <input type="file" accept=".mp3" multiple className="invisible" onChange={e => uploadAudioBook(e)} />
                                             <i
                                                className="font-size-15 py-2 px-3 btn btn-warning btn-rounded text-dark"
                                                style={{
                                                   cursor: "pointer",
                                                }}
                                             >
                                                аудио ном
                                             </i>
                                          </label>
                                       </Col>
                                    </>
                                 </Row>
                              </TabPane>

                              <TabPane tabId={3}>
                                 <Row>
                                    {book_comments_pic.length != 0 ? (
                                       <div className="row justify-content-center mx-auto">
                                          <Col lg="6">
                                             <div className="text-center">
                                                <div className="mb-4">
                                                   <i className="mdi mdi-check-circle-outline text-success display-4" />
                                                </div>
                                                <div>
                                                   <h5>Шинэчлэх</h5>
                                                   <p className="text-muted">Шинэчлэлт хийхийн тулд "Хадгалах" товчийг дарна уу ?</p>
                                                </div>
                                             </div>
                                          </Col>
                                       </div>
                                    ) : (
                                       <Col lg={12}>
                                          <div className="kyc-doc-verification my-3">
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
                                                         <h3>Зураг оруулах</h3>
                                                      </div>
                                                   </div>
                                                )}
                                             </Dropzone>

                                             <div className="dropzone-previews mt-3" id="file-previews">
                                                {referenceFiles.length != 0 &&
                                                   referenceFiles.map((f, i) => {
                                                      return (
                                                         <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete " key={i + "-file"}>
                                                            <div className="p-2">
                                                               <Row className="align-items-center">
                                                                  <Col className="">
                                                                     <Link to="#" className="text-muted font-weight-bold d-flex justify-content-around" style={{ cursor: "default" }}>
                                                                        <p className="w-60 d-block">{f.name.slice(0, 100)}</p>
                                                                        <i
                                                                           onClick={() => {
                                                                              removeRef(f.id)
                                                                              if (!check_update_field.remove_reference) {
                                                                                 set_check_update_field({
                                                                                    ...check_update_field,
                                                                                    remove_reference: true,
                                                                                 })
                                                                              }
                                                                           }}
                                                                           className="dripicons-cross font-size-20 my-auto text-dark d-block"
                                                                           style={{
                                                                              cursor: "pointer",
                                                                              margin: "auto",
                                                                              marginRight: "0",
                                                                           }}
                                                                        />
                                                                     </Link>
                                                                     <p className="m-0 mr-3">
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
                                    )}
                                 </Row>
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
                                    onClick={() => {
                                       if (activeTab === 3) {
                                          set_state({ loading: true })
                                          updateBook()
                                          // set_confirm_edit(true)
                                          togglemodal()
                                       }
                                       if (edit_book_name == "" || coverImage == "" || selectedMulti_category == null || selectedMulti_author == null) {
                                          set_check_field("Гүйцэд утга оруулна уу !")
                                       } else {
                                          toggleTab(activeTab + 1)
                                          set_check_field("")
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
         ) : null}

         {/* {confirm_edit ? (
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
            updateBook()
            set_edit_user_step(false)
          }}
          onCancel={() => {
            set_confirm_edit(false)
            set_edit_user_step(true)
          }}
        ></SweetAlert>
      ) : null} */}
      </>
   )
}
