import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { MDBDataTable } from "mdbreact"
import AddBook from "./AddBook"
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import axios from "axios"
import { ResultPopUp } from "../../contexts/CheckActionsContext"
import UpdateBook from "pages/BookAuthor/UpdateBook"

// book section
const columns = [
   {
      label: "ID",
      field: "book_id",
      // sort: "asc",
      width: 150,
   },
   {
      label: "Нэр",
      field: "book_name",
      // sort: "asc",
      width: 150,
   },
   {
      label: "Зохиолч",
      field: "book_author",
      // sort: "asc",
      width: 100,
   },
   {
      label: "Категори",
      field: "book_category",
      // sort: "asc",
      width: 100,
   },
   {
      label: "Сэтгэгдэлүүд",
      field: "book_comments",
      sort: "disabled",
      width: "100",
   },
   {
      label: "Нийтлэгдсэн огноо",
      field: "book_date",
      sort: "desc",
      width: 70,
   },
   {
      label: "Төрөл",
      field: "type",
      // sort: "asc",
      width: 100,
   },
   {
      label: "Аудио номын үнэ",
      field: "audio_book_price",
      // sort: "asc",
      width: 50,
   },
   {
      label: "Онлайн номын үнэ",
      field: "online_book_price",
      // sort: "asc",
      width: 50,
   },
   {
      label: "Хэвлэмэл номын үнэ",
      field: "book_price",
      // sort: "asc",
      width: 50,
   },
   {
      label: "Хэвлэмэл тоо",
      field: "sale_quantity",
      // sort: "asc",
      width: 50,
   },
   {
      label: "Үйлдэл",
      field: "book_edit",
      sort: "disabled",
      width: 20,
   },
]

const List = props => {
   const [state, set_state] = useContext(ResultPopUp)
   const [data, set_data] = useState(null)
   const [modal, setModal] = useState(false)

   const [book_comments_section, set_book_comments_section] = useState(false)
   const [edit_book_id, set_edit_book_id] = useState(null)
   const [checked, set_checked] = useState(false)
   const [confirm_delete, set_confirm_delete] = useState(false)
   const [remove_comm, set_remove_comm] = useState("")
   const [delete_book_id, set_delete_book_id] = useState(null)
   const [edit_book_comments, set_edit_book_comments] = useState([])

   // axios oor huselt ywuulj delete hiih
   const deleteBook = async id => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      await axios
         .delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/books/${id}`, config)
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

   const initData = booksData => {
      let tempInitialData = booksData.map(d => {
         return {
            book_id: d.id,
            book_name: d.book_name,
            book_date: new Date(d.book_added_date).toLocaleString("mn-MN", {
               timeZone: "Asia/Hovd",
            }),
            book_state: d.book_state,
            type: d.type,
            audio_book_price: (d.audio_book_price != null) != 0 ? d.audio_book_price : `Үнэгүй`,
            online_book_price: (d.online_book_price != null) != 0 ? d.online_book_price : `Үнэгүй`,
            book_price: d.book_price != null ? d.book_price : `Үнэгүй`,
            sale_quantity: d.sale_quantity,
            book_comments: (
               <Link
                  className="d-block text-center"
                  onClick={() => {
                     set_book_comments_section(true)
                     set_edit_book_comments(d.book_comments)
                  }}
               >
                  Харах
               </Link>
            ),
            book_author: (
               <div style={{ maxHeight: "60px", overflow: "scroll" }}>
                  {d.book_author.map(author => (
                     <p className="m-0 mb-1">{author.name}</p>
                  ))}
               </div>
            ),
            book_category: (
               // <select
               //   multiple
               //   size="2"
               //   className="w-100 bg-transparent m-0 p-0"
               //   style={{ border: "none" }}

               // >
               //   {d.book_category.map(author => (
               //     <option className="d-block w-90 text-left">{author.name}</option>
               //   ))}
               // </select>
               <div style={{ maxHeight: "60px", overflow: "scroll" }}>
                  {d.book_category.map(category => (
                     <p className="m-0 mb-1">{category.name}</p>
                  ))}
               </div>
            ),
            book_edit: (
               <Link to="#" className="d-flex justify-content-around">
                  {/* <i
                     onClick={() => {
                        togglemodal()
                        set_edit_book_id(d.id)
                     }}
                     className="bx bxs-edit text-primary font-size-20"
                     id="edittooltip"
                  /> */}
                  <i
                     onClick={() => {
                        set_delete_book_id(d.id)
                        set_confirm_delete(true)
                     }}
                     className="bx bxs-trash text-danger font-size-20"
                  />
               </Link>
            ),
            type: (
               <Link className="d-flex justify-content-around align-items-center">
                  <i style={{ color: d.has_sale ? "#24ea75" : "#767676" }} className="bx bxs-book-open font-size-20" />
                  <i style={{ color: d.has_mp3 ? "#fe2379" : "#767676" }} className="bx bxs-music font-size-20" />
                  <i style={{ color: d.has_pdf ? "#ffd722" : "#767676" }} className="bx bxs-file-pdf font-size-20" />
               </Link>
            ),
         }
      })
      set_data(tempInitialData)
   }

   const book_datatable = {
      columns: columns,
      rows: data,
   }

   useEffect(() => {
      initData(props.books)
   }, [])

   // delete comment
   const removeComment = async comm => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      set_edit_book_comments(edit_book_comments.filter(x => x !== comm))
      await axios
         .delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/book-comments/${comm.id}`, config)
         .then(async res => {
            // setTimeout(() => {
            //    window.location.reload()
            // }, 1500)
         })
         .catch(e => {})
   }
   // popup garch ireh, arilgahad tuslah
   const togglemodal = () => {
      setModal(!modal)
   }

   return (
      <React.Fragment>
         <Row>
            {modal && edit_book_id != null && <UpdateBook book_id={edit_book_id} modal={modal} setModal={setModal} authors={props.available_authors} categories={props.available_categories} />}
            {book_comments_section ? (
               <SweetAlert
                  confirmBtnBsStyle="primary"
                  confirmBtnText="Гарах"
                  style={{
                     padding: "3em",
                     borderRadius: "20px",
                  }}
                  onConfirm={() => {
                     set_book_comments_section(false)
                  }}
               >
                  <CardTitle className="mb-4">Сэтгэгдэлүүд</CardTitle>
                  <Row>
                     {edit_book_comments.map((comment, key) => (
                        <Col
                           lg={12}
                           key={key}
                           className="border pt-3 rounded mb-2"
                           style={{
                              maxHeight: "500px",
                           }}
                        >
                           <div className="d-flex">
                              <p className="text-left">
                                 <strong className="text-primary">{comment.user_name}</strong> - {new Date(comment.created_at).toLocaleString()}
                              </p>
                              <i
                                 className="dripicons-cross font-size-20 my-auto text-dark"
                                 style={{
                                    cursor: "pointer",
                                    margin: "auto",
                                    marginRight: "0",
                                 }}
                                 onClick={() => {
                                    set_checked(true), set_remove_comm(comment)
                                 }}
                              />
                           </div>
                           <p className="text-left">{comment.comment}</p>
                        </Col>
                     ))}
                  </Row>
               </SweetAlert>
            ) : null}

            {confirm_delete ? (
               <SweetAlert
                  title="Та энэ номыг устгах гэж байна !"
                  warning
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Болих"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_confirm_delete(false)
                     set_state({ loading: true })
                     deleteBook(delete_book_id)
                  }}
                  onCancel={() => {
                     set_confirm_delete(false)
                  }}
               ></SweetAlert>
            ) : null}
            {checked ? (
               <SweetAlert
                  title="Энэ комментыг устгах гэж байна !"
                  warning
                  showCancel
                  confirmBtnText="Тийм"
                  cancelBtnText="Болих"
                  confirmBtnBsStyle="success"
                  cancelBtnBsStyle="danger"
                  onConfirm={() => {
                     set_checked(false)
                     removeComment(remove_comm)
                  }}
                  onCancel={() => {
                     set_checked(false)
                  }}
               ></SweetAlert>
            ) : null}
            <Col className="col-12">
               <Card>
                  <CardBody>
                     <div className="d-flex justify-content-between m-0 p-0">
                        <CardTitle>Номны жагсаалт</CardTitle>
                        <CardTitle>
                           <AddBook user_id={props.user_id} available_categories={props.available_categories} available_authors={props.available_authors} />
                        </CardTitle>
                     </div>
                     <MDBDataTable
                        proSelect
                        responsive
                        striped
                        bordered
                        data={book_datatable}
                        noBottomColumns
                        noRecordsFoundLabel={"Ном байхгүй"}
                        infoLabel={["", "-ээс", "дахь ном. Нийт", ""]}
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
