import React, { useEffect, useState, useMemo, useContext } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { Link } from "react-router-dom"
import { Container, Row, Col, Card, CardBody, CardTitle, CardImg, CardText, Alert, Pagination, PaginationLink, PaginationItem } from "reactstrap"

import AddBook from "./AddBook"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import MetaTags from "react-meta-tags"

import axios from "axios"
import { ResultPopUp } from "../../contexts/CheckActionsContext"
import { isEmpty } from "lodash"
require("dotenv").config()

let BookCard = props => {
   return (
      <Col xl={3} lg={4} md={4} sm={6}>
         <Card>
            <CardImg top className="img-fluid mx-auto" src={props.book.book_pic_url} style={{ height: "30vh", resize: "both", overflow: "visible", width: "98%" }} alt={props.book.book_name} />
            <CardBody>
               <CardTitle className="mt-0">{props.book.book_name.slice(0, 30)}</CardTitle>
               <CardText>
                  <Row>
                     <Col xl={6} className="text-left mb-2">
                        Нэмэгдсэн огноо:
                     </Col>
                     <Col xl={6} className="text-right mb-2">
                        <strong className="d-block">{new Date(props.book.book_added_date).toLocaleDateString()}</strong>
                     </Col>
                  </Row>
                  <Row>
                     <Col xl={4} className="text-left">
                        Зохиогч:
                     </Col>
                     <Col xl={8} className="text-right">
                        {/* <b className="d-block">
            {props.book.book_author_name.slice(0, 14)}
          </b> */}
                        <select multiple size="2" className="bg-transparent m-0 p-0" style={{ border: "none" }}>
                           {props.book.book_author_name.map(author => (
                              <option className="p-0 m-0">{author.slice(0, 14)}</option>
                           ))}
                        </select>
                     </Col>
                  </Row>
                  <Row>
                     <Col xl={12} className="text-right">
                        <div class="custom-control custom-checkbox">
                           <input
                              type="checkbox"
                              class="custom-control-input"
                              id={props.book.id}
                              onClick={() => {
                                 if (props.book.is_featured) {
                                    props.set_are_you_sure_title(`"${props.book.book_name}" номыг онцлох номноос хасах гэж байна. Та итгэлтэй байна уу?`)
                                 } else {
                                    props.set_are_you_sure_title(`"${props.book.book_name}" номыг онцлох ном болгох гэж байна. Та итгэлтэй байна уу?`)
                                 }
                                 props.set_book_info_to_update({
                                    id: props.book.id,
                                    state: props.book.is_featured,
                                 })
                                 props.setSelectedBook(props.book)
                                 props.set_confirm_allow(true)
                              }}
                              checked={props.book.is_featured}
                           />
                           <label class="custom-control-label" for={props.book.id}>
                              Онцлох
                           </label>
                        </div>
                     </Col>
                  </Row>
               </CardText>
               <Row>
                  <Col xl={6} className="text-left">
                     <Link to={"/bookSingle/" + props.book.user_id} className="btn btn-primary waves-effect waves-light">
                        Дэлгэрэнгүй
                     </Link>
                  </Col>
                  <Col xl={6} className="d-flex align-items-center justify-content-around">
                     <i
                        style={{
                           color: props.book.has_sale ? "#24ea75" : "#767676",
                           fontSize: "28px",
                        }}
                        className="bx bxs-book-open font-size-30"
                     />
                     <i
                        style={{
                           color: props.book.has_mp3 ? "#fe2379" : "#767676",
                           fontSize: "28px",
                        }}
                        className="bx bxs-music"
                     />
                     <i
                        style={{
                           color: props.book.has_pdf ? "#ffd722" : "#767676",
                           fontSize: "28px",
                        }}
                        className="bx bxs-file-pdf"
                     />
                  </Col>
               </Row>
            </CardBody>
         </Card>
      </Col>
   )
}

const Books = () => {
   var ITEMS_PER_PAGE = 16

   const [state, set_state] = useContext(ResultPopUp)

   const [booksList, setBooksList] = useState([])
   const [admins_info, set_admins_info] = useState([])
   const [searchFilter, setSeatchFilter] = useState("")
   const [isNetworkingError, setIsNetworkingError] = useState(false)
   const [isNetworkLoading, SetIsNetworkLoading] = useState(true)
   const [confirm_allow, set_confirm_allow] = useState(false)
   const [are_you_sure_title, set_are_you_sure_title] = useState("")
   const [book_info_to_update, set_book_info_to_update] = useState({ id: null, state: null })

   const [selectedBook, setSelectedBook] = useState(null)

   const [showPaginationIndex, setShowPaginationIndex] = useState(0)
   const [showBookIndex, setShowBookIndex] = useState(0)

   async function featureBook() {
      set_state({ loading: true })
      
      const featuredPicture = new FormData()

      let data = {}

      data["is_featured"] = !book_info_to_update.state
      featuredPicture.append("data", JSON.stringify(data))

      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${book_info_to_update.id}`,
         method: "PUT",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
         data: featuredPicture
      })
         .then(res => {
            set_state({ loading: false })
            set_state({ success: true })
            let tempBook = Object.assign(booksList)
            tempBook.find(book => book.id === res.data.id).is_featured = res.data.is_featured
         })
         .catch(e => {
            set_state({ loading: false })
            set_state({ error: true })
         })
   }

   const fetchData = async () => {
      await axios({
         method: "GET",
         headers: {
            Authorization: `${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
         url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/all-books-list`,
      })
         .then(res => {
            setBooksList(res.data)
            axios({
               url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/all-admins-list`,
               method: "GET",
               headers: {
                  Authorization: `${JSON.parse(localStorage.getItem("user_information")).jwt}`,
               },
            })
               .then(admin => {
                  setIsNetworkingError(false)
                  set_admins_info(admin.data)
               })
               .catch(err => {
                  setIsNetworkingError(true)
                  // SetIsNetworkLoading(true)
               })
         })
         .catch(err => {
            setIsNetworkingError(true)
            // SetIsNetworkLoading(true)
         })
   }

   useEffect(() => {
      fetchData()
   }, [])

   const visibleBooks = useMemo(() => {

      let temp = booksList

      if (searchFilter !== '') {

         temp = booksList.filter((p) => {
            let found = false

            if (p != null && p.book_name.toUpperCase().includes(searchFilter.toUpperCase())) {
               found = true
            }

            return found
         })
      }

      return temp
      
   }, [booksList, searchFilter])

   const showBooks = useMemo(() => {
      let result = []
      let temp = []
      let count = 0
      let counts = 0

      visibleBooks.forEach((book) => {
         if (count == ITEMS_PER_PAGE) {
            count = 1
            result.push(temp)
            temp = []
            temp.push(book)
         } else {
            temp.push(book)
            count += 1
         }

         counts += 1
      })
      result.push(temp)

      return result
   }, [visibleBooks])

   return (
      <React.Fragment>
         <div className="page-content">
            <MetaTags>
               <title>Номны жагсаалт</title>
            </MetaTags>
            <Breadcrumbs title="Бүртгэлтэй ном" breadcrumbItem="Номны жагсаалт" />
            {isNetworkingError ? (
               <Alert color="danger" role="alert">
                  Сүлжээ уналаа ! Дахин ачааллна уу ?
               </Alert>
            ) : (
               <>
                  {isNetworkLoading && admins_info.length != 0 ? (
                     <Container fluid>
                        <Row className="d-flex justify-content-between align-items-center">
                           <Col lg={4}>
                              <AddBook admins_info={admins_info} setIsNetworkingError={setIsNetworkingError} />
                           </Col>

                           <Col xl={4} lg={4} md={6} xs={6} sm={6}>
                              <form className="app-search d-none d-lg-block">
                                 <div className="position-relative">
                                    <input
                                       type="text"
                                       className="form-control"
                                       placeholder="Search..."
                                       onChange={event => {
                                          setSeatchFilter(event.target.value)
                                       }}
                                    />
                                    <span className="bx bx-search-alt" />
                                 </div>
                              </form>
                           </Col>
                           <Col lg={4}>
                              <Pagination className="pagination pagination-rounded d-flex justify-content-end mb-2">
                                 <PaginationItem disabled={showPaginationIndex == 0}>
                                    <PaginationLink
                                       previous
                                       href="#"
                                       onClick={() => {
                                          setShowBookIndex(showBookIndex - 1),
                                          setShowPaginationIndex(showPaginationIndex - 1)
                                       }}
                                    />
                                 </PaginationItem>
                                 {showBooks.length > 6 
                                    ? showBooks.slice(showPaginationIndex, showPaginationIndex + 5).map((item, i) => (
                                       <PaginationItem active={i + showPaginationIndex == showBookIndex} key={i}>
                                          <PaginationLink
                                             onClick={() => setShowBookIndex(showPaginationIndex + i)}
                                             href="#"
                                          >
                                             {i + showPaginationIndex + 1}
                                          </PaginationLink>
                                       </PaginationItem>
                                    )) 
                                    : showBooks.map((item, i) => (
                                       <PaginationItem active={i == showBookIndex} key={i}>
                                          <PaginationLink
                                             onClick={() => setShowBookIndex(i)}
                                             href="#"
                                          >
                                             {i+1}
                                          </PaginationLink>
                                       </PaginationItem>
                                    )) 
                                 }
                                 <PaginationItem disabled={showBooks.length > 6 ? showPaginationIndex == showBooks.length - 5 : showBookIndex == showBooks.length - 1}>
                                    <PaginationLink
                                       next
                                       href="#"
                                       onClick={() => {
                                          setShowBookIndex(showBookIndex + 1)
                                          setShowPaginationIndex(showPaginationIndex + 1)
                                       }}
                                    />
                                 </PaginationItem>
                              </Pagination>
                           </Col>
                        </Row>
                        <Row>
                           {!isEmpty(showBooks) &&
                              (showBooks[showBookIndex] || []).map((book) => (
                                 book != null ? <BookCard book={book} key={book.id} setSelectedBook={setSelectedBook} set_are_you_sure_title={set_are_you_sure_title} set_book_info_to_update={set_book_info_to_update} set_confirm_allow={set_confirm_allow} /> : null
                              ))
                           }
                        </Row>
                     </Container>
                  ) : (
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
                  )}
               </>
            )}

            {confirm_allow ? (
               <SweetAlert
                  title={are_you_sure_title}
                  warning
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Болих"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_confirm_allow(false)
                     set_state({ loading: true })
                     featureBook()
                  }}
                  onCancel={() => {
                     set_confirm_allow(false)
                  }}
               ></SweetAlert>
            ) : null}
         </div>
      </React.Fragment>
   )
}

export default Books
