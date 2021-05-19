import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
import { Link } from "react-router-dom"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardImg,
  CardText,
  Alert,
  Pagination,
  PaginationLink,
  PaginationItem,
  FormGroup,
  Button,
} from "reactstrap"

import AddBook from "./AddBook"
import Breadcrumbs from "../../components/Common/Breadcrumb"

import axios from "axios"
require("dotenv").config()

let BookCard = props => {
  return (
    <Col xl={3} lg={4} md={4} sm={4}>
      <Card>
        <CardImg
          top
          className="img-fluid mx-auto"
          src={process.env.REACT_APP_STRAPI_BASE_URL + props.book.book_pic_url}
          style={{
            height: "30vh",
            resize: "both",
            overflow: "visible",
            width: "98%",
          }}
          alt={props.book.book_name}
        />
        <CardBody>
          <CardTitle className="mt-0">
            {props.book.book_name.slice(0, 30)}
          </CardTitle>
          <CardText>
            <Row>
              <Col xl={6} className="text-left">
                Нэмэгдсэн огноо:
              </Col>
              <Col xl={6} className="text-right mb-2">
                <strong className="d-block">
                  {new Date(props.book.book_added_date).toLocaleDateString()}
                </strong>
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
                <select
                  multiple
                  size="2"
                  className="bg-transparent m-0 p-0"
                  style={{ border: "none" }}
                >
                  {props.book.book_author_name.map(author => (
                    <option className="p-0 m-0">{author.slice(0, 14)}</option>
                  ))}
                </select>
              </Col>
            </Row>
            <Row>
              <Col xl={12} className="text-right mt-2">
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id={props.book.id}
                    onClick={() => {
                      if (props.book.is_featured) {
                        props.set_are_you_sure_title(
                          `"${props.book.book_name}" номыг онцлох номноос хасах гэж байна. Та итгэлтэй байна уу?`
                        )
                      } else {
                        props.set_are_you_sure_title(
                          `"${props.book.book_name}" номыг онцлох ном болгох гэж байна. Та итгэлтэй байна уу?`
                        )
                      }
                      props.set_book_info_to_update({
                        id: props.book.id,
                        state: props.book.is_featured,
                      })
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
              <Link
                to={"/bookSingle/" + props.book.user_id}
                className="btn btn-primary waves-effect waves-light"
              >
                Дэлгэрэнгүй
              </Link>
            </Col>
            <Col
              xl={6}
              className="d-flex align-items-center justify-content-around"
            >
              <i
                style={{
                  color: props.book.has_sale ? "#24ea75" : "#767676",
                  fontSize: "28px",
                }}
                className="bx bxs-book-open font-size-30"
              />
              <i
                style={{
                  color: props.book.has_pdf ? "#fe2379" : "#767676",
                  fontSize: "28px",
                }}
                className="bx bxs-music"
              />
              <i
                style={{
                  color: props.book.has_audio ? "#ffd722" : "#767676",
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
  var ITEMS_PER_PAGE = 12

  const [booksList, setBooksList] = useState([])
  const [admins_info, set_admins_info] = useState([])
  const [book_info, set_book_info] = useState(null)
  const [searchItms, setSearchItms] = useState("")
  const [admins_select, set_admins_select] = useState(true)
  const [shiftBookform, set_shiftBookform] = useState(false)
  const [get_admin, set_get_admin] = useState(false)
  const [admin_id, set_admin_id] = useState(1)
  const [isNetworkingError, setIsNetworkingError] = useState(false)
  const [isNetworkLoading, SetIsNetworkLoading] = useState(true)
  const [confirm_allow, set_confirm_allow] = useState(false)
  const [pagination_current, set_pagination_current] = useState(1)
  const [pagination_pages, set_pagination_pages] = useState([])
  const [are_you_sure_title, set_are_you_sure_title] = useState("")
  const [book_info_to_update, set_book_info_to_update] = useState({
    id: null,
    state: null,
  })
  const [success_dialog, setsuccess_dialog] = useState(false)
  const [error_dialog, seterror_dialog] = useState(false)

  async function featureBook() {
    // setLoad(true)
    await axios({
      url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${book_info_to_update.id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
      data: {
        is_featured: !book_info_to_update.state,
      },
    })
      .then(res => {
        // setLoad(false)
        set_confirm_allow(false)
        let tempBook = Object.assign(booksList)
        tempBook.find(book => book.id === res.data.id).is_featured =
          res.data.is_featured
        setsuccess_dialog(true)
      })
      .catch(err => {
        set_confirm_allow(false)
        // setLoad(false)
        seterror_dialog(true)
      })
  }

  const fetchData = async () => {
    await axios({
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
      url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/all-books-list`,
    })
      .then(res => {
        setBooksList(res.data)
        axios({
          url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/all-admins-list`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user_information")).jwt
            }`,
          },
        })
          .then(admin => {
            setIsNetworkingError(false)
            set_admins_info(admin.data)
          })
          .catch(err => {
            setIsNetworkingError(true)
            SetIsNetworkLoading(true)
          })
      })
      .catch(err => {
        setIsNetworkingError(true)
        SetIsNetworkLoading(true)
      })
  }

  useEffect(() => {
    let tempPaginations = []
    for (let i = 1; i <= Math.ceil(booksList.length / ITEMS_PER_PAGE); i++) {
      tempPaginations.push(i)
    }

    set_pagination_pages(tempPaginations)
  }, [booksList])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="Бүртгэлтэй ном" breadcrumbItem="Номны жагсаалт" />
        {isNetworkingError ? (
          <Alert color="danger" role="alert">
            Сүлжээ уналаа ! Дахин ачааллна уу ?
          </Alert>
        ) : (
          <>
            {isNetworkLoading && admins_info.length != 0 ? (
              <Container fluid>
                <Row>
                  <Col lg={4}>
                    <AddBook
                      admins_info={admins_info}
                      setIsNetworkingError={setIsNetworkingError}
                    />
                  </Col>

                  <Col xl={4} lg={4} md={6} xs={6} sm={6}>
                    <form className="app-search d-none d-lg-block">
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search..."
                          onChange={event => {
                            setSearchItms(event.target.value)
                          }}
                        />
                        <span className="bx bx-search-alt" />
                      </div>
                    </form>
                  </Col>
                  <Col lg={3}>
                    <Pagination
                      style={{ backgroundColor: "red" }}
                      aria-label="Page navigation example"
                      className="d-flex justify-content-end mt-3"
                    >
                      <PaginationItem
                        disabled={pagination_current == 1}
                        onClick={() => {
                          if (pagination_current != 1)
                            set_pagination_current(pagination_current - 1)
                        }}
                      >
                        <PaginationLink>
                          <i className="mdi mdi-chevron-left" />
                        </PaginationLink>
                      </PaginationItem>

                      {pagination_pages.map(page => (
                        <PaginationItem
                          onClick={() => {
                            set_pagination_current(page)
                          }}
                          active={page == pagination_current}
                        >
                          <PaginationLink href="#">{page}</PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem
                        disabled={
                          pagination_current ==
                          pagination_pages[pagination_pages.length - 1]
                        }
                      >
                        <PaginationLink
                          href="#"
                          onClick={() =>
                            set_pagination_current(pagination_current + 1)
                          }
                        >
                          <i className="mdi mdi-chevron-right" />
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </Col>
                </Row>
                <Row>
                  {booksList
                    .filter(val => {
                      if (searchItms === "") {
                        return val
                      } else if (
                        val.book_name
                          .toLocaleLowerCase()
                          .includes(searchItms.toLocaleLowerCase())
                      ) {
                        return val
                      }
                    })
                    .map(book => {
                      if (
                        book.pagination_number <=
                          pagination_current * ITEMS_PER_PAGE &&
                        book.pagination_number >
                          pagination_current * ITEMS_PER_PAGE - ITEMS_PER_PAGE
                      )
                        return (
                          <BookCard
                            book={book}
                            key={book.id}
                            set_are_you_sure_title={set_are_you_sure_title}
                            set_book_info_to_update={set_book_info_to_update}
                            set_confirm_allow={set_confirm_allow}
                          />
                        )
                    })}
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
              featureBook()
            }}
            onCancel={() => {
              set_confirm_allow(false)
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
      </div>
    </React.Fragment>
  )
}

export default Books
