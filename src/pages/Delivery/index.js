import React, { useEffect, useState, useContext } from "react"
import axios from "axios"

import { Link } from "react-router-dom"
import { Container, Row, Col, Card, CardBody, CardTitle, Button, Modal } from "reactstrap"
import { MDBDataTable } from "mdbreact"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import SweetAlert from "react-bootstrap-sweetalert"
import MetaTags from "react-meta-tags"
import { Alert } from "reactstrap"
import { ResultPopUp } from "../../contexts/CheckActionsContext"
require("dotenv").config()

const not_delivered_columns = [
   { label: "Номын нэр", field: "book_name", sort: "asc" },
   { label: "Хэрэглэгчийн утас", field: "customer_phone", sort: "disabled", width: "100" },
   { label: "Хэрэглэгчийн нэр", field: "customer_name", sort: "disabled" },
   { label: "Хүргэх хаяг", field: "destination", sort: "asc" },
   { label: "Огноо", field: "created_at", sort: "disabled" },
   { label: "Хүргэлт", field: "finish_order", sort: "disabled" },
]

const delivered_columns = [
   { label: "Номын нэр", field: "book_name", sort: "asc" },
   { label: "Хэрэглэгчийн утас", field: "customer_phone", sort: "disabled" },
   { label: "Хэрэглэгчийн нэр", field: "customer_name", sort: "disabled" },
   { label: "Огноо", field: "updated_at" },
]

export default function Delivery() {
   const [state, set_state] = useContext(ResultPopUp)

   const [delivered_data, set_delivered_data] = useState([])
   const [not_delivered_data, set_not_delivered_data] = useState([])
   const [update_data, set_update_data] = useState(null)
   const [id, set_id] = useState(0)

   const [isNetworkError, SetIsNetworkError] = useState(false)
   const [isNetworkLoading, SetIsNetworkLoading] = useState(true)
   const [order_id, set_order_id] = useState(null)
   const [confirm_order, set_confirm_order] = useState(false)
   const [book_desc_modal_center, set_book_desc_modal_center] = useState(false)
   const [book_for_description, set_book_for_description] = useState({})

   const removeFromNotDelivered = async id => {
      const url = `${process.env.REACT_APP_STRAPI_BASE_URL}/delivery-registrations/${id}`

      await axios
         .put(url, { is_delivered: true }, { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}` } })
         .then(async res => {
            set_state({ loading: false })
            set_state({ success: true })
            setTimeout(() => {
               window.location.reload()
            }, 2000)
         })
         .catch(e => {
            set_state({ loading: false })
            set_state({ error: true })
         })
   }

   const initializeData = (deliveries, books) => {
      let delivered_data_temp = []
      let not_delivered_data_temp = []
      deliveries.forEach(delivery => {
         if (delivery.is_delivered) {
            delivered_data_temp.push({
               book_name: (
                  <a
                     onClick={() => {
                        set_book_for_description(books.find(book => book.id == delivery.customer_paid_book?.book))
                        set_book_desc_modal_center(true)
                     }}
                  >
                     {books.find(book => book.id == delivery.customer_paid_book?.book)?.name}
                  </a>
               ),
               destination: delivery.order_destination,
               customer_phone: delivery.customer?.phone,
               customer_name: delivery.customer?.username,
               updated_at: new Date(delivery.updated_at).toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar" }),
            })
         } else {
            not_delivered_data_temp.push({
               book_name: (
                  <a
                     onClick={() => {
                        set_book_for_description(books.find(book => book.id == delivery.customer_paid_book?.book))
                        set_book_desc_modal_center(true)
                     }}
                  >
                     {books.find(book => book.id == delivery.customer_paid_book?.book)?.name}
                  </a>
               ),
               destination: delivery.order_destination,
               customer_phone: delivery.customer.phone,
               customer_name: delivery.customer.fullname,
               created_at: new Date(delivery.updated_at).toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar" }),
               finish_order: (
                  <Button
                     type="submit"
                     className="btn btn-info mx-auto d-block"
                     onClick={() => {
                        set_id(delivery.id)
                        set_confirm_order(true)
                        set_order_id(delivery.id)
                     }}
                  >
                     Дуусгах
                  </Button>
               ),
            })
         }
      })
      // console.log(not_delivered_data_temp)
      set_update_data(not_delivered_data_temp[id])
      set_delivered_data(delivered_data_temp)
      set_not_delivered_data(not_delivered_data_temp)
   }

   const delivered_datatable = {
      columns: delivered_columns,
      rows: delivered_data,
   }

   const not_delivered_datatable = {
      columns: not_delivered_columns,
      rows: not_delivered_data,
   }

   async function fetchData() {
      // try {
      let delivery = await axios({ url: `${process.env.REACT_APP_STRAPI_BASE_URL}/delivery-registrations`, method: "GET", headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}` } }).catch(err => {
         throw "error"
      })

      let books = await axios({ url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books`, method: "GET", headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}` } }).catch(err => {
         throw "error"
      })

      console.log("delivery.data")
      console.log(delivery.data)

      initializeData(delivery.data, books.data)
      SetIsNetworkLoading(false)
      // } catch (err) {
      //    SetIsNetworkLoading(false)
      // }
   }

   useEffect(() => {
      fetchData()
   }, [])

   return (
      <React.Fragment>
         <div className="page-content">
            <MetaTags>
               <title>Хүргэлт</title>
            </MetaTags>
            <Container fluid>
               <Breadcrumbs title="Хүргэлт" breadcrumbItem="Хүргэлтийн мэдээлэл" />
               {isNetworkError ? (
                  <Alert color="danger" role="alert" className="w-100 text-center">
                     Сүлжээ уналаа ! Дахин ачааллна уу ?
                  </Alert>
               ) : (
                  <>
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
                                    <CardTitle className="font-size-20">Хүргэгдээгүй захиалгууд</CardTitle>
                                    <MDBDataTable
                                       proSelect
                                       responsive
                                       striped
                                       bordered
                                       data={not_delivered_datatable}
                                       proSelect
                                       noBottomColumns
                                       noRecordsFoundLabel={"Хүргэлт байхгүй"}
                                       infoLabel={["", "-ээс", "дахь хүргэлт. Нийт", ""]}
                                       entries={5}
                                       entriesOptions={[5, 10, 20]}
                                       paginationLabel={["Өмнөх", "Дараах"]}
                                       searchingLabel={"Хайх"}
                                       searching
                                    />
                                 </CardBody>
                              </Card>
                           </Col>
                           <Col lg={12}>
                              <Card>
                                 <CardBody>
                                    <CardTitle className="font-size-20">Хүргэгдсэн захиалгууд</CardTitle>
                                    <MDBDataTable
                                       proSelect
                                       responsive
                                       striped
                                       bordered
                                       data={delivered_datatable}
                                       proSelect
                                       noBottomColumns
                                       noRecordsFoundLabel={"Хүргэлт байхгүй"}
                                       infoLabel={["", "-ээс", "дахь хүргэлт. Нийт", ""]}
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
                     )}
                  </>
               )}
               {confirm_order ? (
                  <SweetAlert
                     title="Хүргэлт амжилттай болсон уу ?"
                     warning
                     showCancel
                     confirmBtnText="Тийм"
                     cancelBtnText="Болих"
                     confirmBtnBsStyle="success"
                     cancelBtnBsStyle="danger"
                     onConfirm={() => {
                        set_state({ loading: true })
                        set_confirm_order(false)
                        removeFromNotDelivered(id)
                     }}
                     onCancel={() => {
                        set_confirm_order(false)
                     }}
                  ></SweetAlert>
               ) : null}
               <Modal
                  size="lg"
                  isOpen={book_desc_modal_center}
                  toggle={() => {
                     set_book_desc_modal_center(!book_desc_modal_center)
                  }}
                  centered={true}
               >
                  <div className="modal-header">
                     <h5 className="modal-title mt-0">Номын мэдээлэл </h5>
                     <button
                        type="button"
                        onClick={() => {
                           set_book_desc_modal_center(false)
                        }}
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                     >
                        <span aria-hidden="true">&times;</span>
                     </button>
                  </div>
                  <div className="modal-body">
                     <Row>
                        <Col xs={4}>{book_for_description?.picture ? <img alt={book_for_description?.name + " name"} src={`${process.env.REACT_APP_STRAPI_BASE_URL}${book_for_description?.picture.url}`} height="200" width="100%" /> : null}</Col>
                        <Col xs={8}>
                           <table style={{ width: "100%" }}>
                              <tr>
                                 <td>
                                    <b>Номын нэр:</b>
                                 </td>
                                 <td>{book_for_description?.name}</td>
                              </tr>
                              <tr>
                                 <td>
                                    <b>Үнэ:</b>
                                 </td>
                                 <td>{book_for_description?.book_price}</td>
                              </tr>
                              <tr>
                                 <td>
                                    <b>Зохиолчид:</b>
                                 </td>
                                 <td>{getAuthorsName(book_for_description)}</td>
                              </tr>
                              <tr>
                                 <td>
                                    <b>Бүртгэгдсэн огноо:</b>
                                 </td>
                                 <td>{new Date(book_for_description?.created_at).toLocaleString()}</td>
                              </tr>
                           </table>
                        </Col>
                     </Row>
                  </div>
               </Modal>
            </Container>
         </div>
      </React.Fragment>
   )
   function getAuthorsName(book) {
      let authors = ""
      if (book.book_authors != undefined) book?.book_authors.forEach(author => (authors += `${author.author_name}   `))
      return authors
   }
}
