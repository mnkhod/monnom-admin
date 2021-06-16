import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import { useLocation, useHistory } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
import MetaTags from "react-meta-tags"

// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ClassicEditor from "ckeditor5-custom-build/build/ckeditor"
// import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import CustomUploadPlugin from "./CustomUploadPlugin"

import dotenv from "dotenv"
dotenv.config()

import axios from "axios"
import { ResultPopUp } from "contexts/CheckActionsContext"

export default function BlogSingle(props) {
   const [state, set_state] = useContext(ResultPopUp)
   const location = useLocation()
   const history = useHistory()
   const [blog, setBlog] = useState(location.query?.blog)
   const [imageFile, setImageFile] = useState(null)
   const [title, setTitle] = useState(blog?.title)
   const [richTextContent, setRichTextContent] = useState(blog?.content)
   const [categories, setCategories] = useState([])
   const [categoryId, setCategoryId] = useState(blog?.blog_category?.id)
   const [isDelete, setIsDelete] = useState(false)

   const [errorMsg, setErrorMsg] = useState("")
   const isError = useMemo(() => {
      return errorMsg && errorMsg.length > 0
   }, [errorMsg])

   const [warningMessage, setWarningMessage] = useState("")
   const isWarning = useMemo(() => {
      return warningMessage && warningMessage.length > 0
   }, [warningMessage])

   const [successMsg, setSuccessMsg] = useState("")
   const isSuccess = useMemo(() => {
      return successMsg && successMsg.length > 0
   }, [successMsg])

   const category = useMemo(() => {
      return categories.filter(c => c.id == categoryId)[0]
   }, [categoryId])

   const imageUrl = useMemo(() => {
      if (blog) {
         const url = blog.picture?.url || ""
         return url.startsWith("/") ? `${process.env.REACT_APP_STRAPI_BASE_URL}${blog.picture?.url}` : url
      }
      if (imageFile) {
         return URL.createObjectURL(imageFile)
      }
      return ""
   }, [imageFile, blog])

   const handleCategory = e => {
      setCategoryId(e.target.value)
   }

   const refreshCategories = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }
      try {
         const response = await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}/blog-categories`, config)
         setCategories(response.data)
      } catch (e) {}
   }

   useEffect(() => {
      refreshCategories()
   }, [])

   const handleRichTextChange = (e, editor) => {
      setRichTextContent(editor.getData())
   }

   const imageHandler = async e => {
      e.preventDefault()
      const imgFile = e.target.files[0]
      setImageFile(imgFile)
   }

   // create/update
   const handleSubmit = async e => {
      if (!(title || "").length) {
         setWarningMessage("Мэдээний гарчиг оруулна уу")
         return
      }
      if (!(imageUrl || "").length) {
         setWarningMessage("Мэдээний зураг оруулна уу")
         return
      }
      set_state({ loading: true })
      e.preventDefault()
      const config = {
         headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }
      try {
         let formData = new FormData()
         const body = {
            title,
            content: richTextContent,
            blog_category: categoryId,
         }
         formData.append("data", JSON.stringify(body))
         if (imageFile) {
            formData.append("files.picture", imageFile, imageFile.name)
         }
         let response
         if (blog) {
            // update
            response = await axios.put(`${process.env.REACT_APP_STRAPI_BASE_URL}/blogs/${blog.id}`, formData, config)
            set_state({ loading: false })
            set_state({ success: true })
         } else {
            // create
            response = await axios.post(`${process.env.REACT_APP_STRAPI_BASE_URL}/blogs`, formData, config)
            set_state({ loading: false })
            set_state({ success: true })
         }
         setBlog(response.data)
      } catch (e) {
         setErrorMsg("Алдаа гарлаа")
         set_state({ success: false })
      }
   }

   // delete
   const handleDelete = async () => {
      set_state({ loading: false })
      const config = {
         headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      if (!blog) {
         return
      }
      try {
         const response = await axios.delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/blogs/${blog.id}`, config)
         set_state({ success: true })
         history.goBack()
      } catch (e) {
         setErrorMsg("Алдаа гарлаа")
      }
   }

   useEffect(() => {
      // ClassicEditor.create(document.querySelector('#ckeditor'))
   }, [])

   const actions = useMemo(() => {
      if (!blog) {
         return <></>
      }
      return (
         <div className="d-flex gap-3 justify-content-end">
            <Button color="danger" onClick={() => setIsDelete(true)}>
               Устгах
            </Button>
         </div>
      )
   }, [blog])

   return (
      <>
         {isDelete && (
            <SweetAlert
               title="Устгахдаа итгэлтэй байна уу?"
               warning
               showCancel
               confirmBtnText="Тийм"
               cancelBtnText="Болих"
               confirmBtnBsStyle="success"
               cancelBtnBsStyle="danger"
               onConfirm={() => {
                  set_state({ loading: true })
                  handleDelete()
                  setIsDelete(false)
               }}
               onCancel={() => {
                  setIsDelete(false)
               }}
            />
         )}
         {isError ? (
            <SweetAlert
               title={errorMsg}
               danger
               showCloseButton={false}
               onConfirm={() => {
                  setErrorMsg("")
               }}
               onCancel={() => {
                  setErrorMsg("")
               }}
            />
         ) : (
            <></>
         )}
         {isWarning ? (
            <SweetAlert
               title={warningMessage}
               warning
               showCloseButton={false}
               onConfirm={() => {
                  setWarningMessage("")
               }}
               onCancel={() => {
                  setWarningMessage("")
               }}
            />
         ) : (
            <></>
         )}
         {isSuccess ? (
            <SweetAlert
               title={successMsg}
               success
               showCloseButton={false}
               onConfirm={() => {
                  setSuccessMsg("")
               }}
               onCancel={() => {
                  setSuccessMsg("")
               }}
            />
         ) : (
            <></>
         )}
         <div className="page-content">
            <MetaTags>
               <title>Мэдээ</title>
            </MetaTags>
            <Container fluid>
               <Row>
                  <Col>{actions}</Col>
               </Row>
               <Row>
                  <Col>
                     <FormGroup>
                        <Label>Мэдээний гарчиг</Label>
                        <Input required value={title} onChange={e => setTitle(e.target.value)} />
                     </FormGroup>
                  </Col>
               </Row>
               <Row>
                  <Col>
                     <FormGroup>
                        <Label>Мэдээний ангилал</Label>
                        <Input type="select" value={categoryId} onChange={handleCategory}>
                           {categories.map(c => (
                              <option key={c.id} value={c.id}>
                                 {c.name}
                              </option>
                           ))}
                        </Input>
                     </FormGroup>
                  </Col>
               </Row>
               <Row>
                  <Col>
                     <FormGroup>
                        <Label>Мэдээний зураг</Label>
                        <Input type="file" onChange={imageHandler} accept={"image/png, image/gif, image/jpeg"} />
                     </FormGroup>
                  </Col>
               </Row>
               <Row>
                  <Col>
                     <div className="text-center mb-5">
                        <img src={imageUrl} />
                     </div>
                  </Col>
               </Row>
               <Row>
                  <Col>
                     <div className="App">
                        <CKEditor
                           editor={ClassicEditor}
                           data={richTextContent}
                           onChange={handleRichTextChange}
                           config={{
                              extraPlugins: [CustomUploadPlugin],
                              toolbar: {
                                 items: [
                                    "heading",
                                    "|",
                                    "fontfamily",
                                    "fontsize",
                                    "|",
                                    "alignment",
                                    "|",
                                    "fontColor",
                                    "fontBackgroundColor",
                                    "|",
                                    "bold",
                                    "italic",
                                    "strikethrough",
                                    "underline",
                                    "subscript",
                                    "superscript",
                                    "|",
                                    "link",
                                    "|",
                                    "outdent",
                                    "indent",
                                    "|",
                                    "bulletedList",
                                    "numberedList",
                                    "todoList",
                                    "|",
                                    "code",
                                    "codeBlock",
                                    "|",
                                    "insertTable",
                                    "|",
                                    "uploadImage",
                                    "blockQuote",
                                    "|",
                                    "undo",
                                    "redo",
                                    "intent",
                                    "outtent",
                                    "|",
                                    "embed",
                                    "|",
                                    "htmlEmbed",
                                    "highlight",
                                    "image",
                                    "imageCaption",
                                    "imageResize",
                                    "ImageStyle",
                                    "|",
                                    "imageToolbar",
                                    "imageInsert",
                                    "intent",
                                    "intentBlock",
                                    "italic",
                                    "linkImage",
                                    "pageBreak",
                                    "sideImage",
                                 ],
                                 shouldNotGroupWhenFull: true,
                              },
                           }}
                        />
                     </div>
                  </Col>
               </Row>
               <Row className="mt-3 mb-5">
                  <Button color="primary" onClick={handleSubmit} className="text-white" href="#">
                     {blog ? "Хадгалах" : "Мэдээнд нэмэх"}
                  </Button>
               </Row>
            </Container>
         </div>
      </>
   )
}
