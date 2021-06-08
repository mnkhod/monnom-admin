import React, { useEffect, useState, useContext } from "react"
import { Badge, Modal } from "reactstrap"

import axios from "axios"
import { MDBDataTable } from "mdbreact"
import { Link } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
import { ResultPopUp } from "../../contexts/CheckActionsContext"

require("dotenv").config()

const columns = [
   { label: "Нэр", field: "name", sort: "asc", width: 150 },
   { label: "Төрөл", field: "type", sort: "asc", width: 100 },
   { label: "Онлайн ном худалдан авалт", field: "online_books_order", sort: "disabled", width: 60 },
   { label: "Аудио ном худалдан авалт", field: "audio_books_order", sort: "disabled", width: 60 },
   // { label: "Биет худалдан авалт", field: "physical_books_order", sort: "disabled", width: 60 },
]

const GivePermission = props => {
   const [state, set_state] = useContext(ResultPopUp)

   const [books, set_books] = useState([])
   const [book_data, set_book_data] = useState([])
   const [paid_online_books, set_paid_online_books] = useState([])
   const [paid_audio_books, set_paid_audio_books] = useState([])
   const [paid_books, set_paid_books] = useState([])
   const [confirm_allow_ebooks, set_confirm_allow_ebooks] = useState(false)
   const [selected_book, set_selected_book] = useState(null)

   const table_data = {
      columns: columns,
      rows: book_data,
   }

   const initialState = () => {
      console.log(props.selected_user_id)
      console.log(books)
      let tempCols = books.map(book => {
         return {
            name: book.name,
            type: (
               <Link className="d-flex justify-content-around align-items-center">
                  <i style={{ color: book.has_pdf ? "#ffd722" : "#767676" }} className="bx bxs-file-pdf font-size-20" />
                  <i style={{ color: book.has_audio ? "#fe2379" : "#767676" }} className="bx bxs-music font-size-20" />
                  <i style={{ color: book.has_sale ? "#24ea75" : "#767676" }} className="bx bxs-book-open font-size-20" />
               </Link>
            ),
            physical_books_order: book.has_sale && (
               <Badge color={noticeIsBoughtBook(book.id) ? "success" : "primary"} className="mr-1 font-size-13">
                  <strong>{noticeIsBoughtBook(book.id) ? "Худалдаж авсан" : "Худалдаж аваагүй"}</strong>
               </Badge>
            ),
            online_books_order: book.has_pdf && (
               <Badge color={noticeIsBoughtEbook(book.id) ? "success" : "primary"} className="mr-1 font-size-13">
                  <strong
                     onClick={() => {
                        set_selected_book({ id: book.id, model_name: "customer-paid-ebooks", state: noticeIsBoughtAudioBook(book.id) })
                        set_confirm_allow_ebooks(true)
                     }}
                     style={{ cursor: "pointer" }}
                  >
                     {noticeIsBoughtEbook(book.id) ? "Худалдаж авсан" : "Худалдаж аваагүй"}
                  </strong>
               </Badge>
            ),

            audio_books_order: book.has_audio && (
               <Badge color={noticeIsBoughtAudioBook(book.id) ? "success" : "primary"} className="mr-1 font-size-13">
                  <strong
                     onClick={() => {
                        set_selected_book({ id: book.id, model_name: "customer-paid-audio-books", state: noticeIsBoughtAudioBook(book.id) })
                        set_confirm_allow_ebooks(true)
                     }}
                     style={{
                        cursor: "pointer",
                     }}
                  >
                     {noticeIsBoughtAudioBook(book.id) ? "Худалдаж авсан" : "Худалдаж аваагүй"}
                  </strong>
               </Badge>
            ),
         }
      })
      set_book_data(tempCols)
   }

   async function givePermissionToCustomer() {
      if (selected_book == null || props.selected_user_id == null) {
         set_state({ error: true })
         return
      }

      if (selected_book.state) {
         deleteUserBoughtBook()
      } else {
         createUserBoughtBook()
      }

      // await axios({
      //    url: `${process.env.REACT_APP_STRAPI_BASE_URL}/${selected_book.model_name}`,
      //    method: "POST",
      //    headers: {
      //       Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
      //    },
      //    data: {
      //       book: selected_book,
      //       users_permissions_user: props.selected_user_id,
      //    },
      // })
      //    .then(res => {
      // set_state({ loading: false })
      // set_state({ success: true })
      // set_paid_online_books([...paid_online_books, res.data])
      //    })
      //    .catch(err => {
      //       set_state({ loading: false })
      //       set_state({ error: true })
      //    })
   }

   async function createUserBoughtBook() {
      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/${selected_book.model_name}`,
         method: "POST",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
         data: {
            book: selected_book.id,
            users_permissions_user: props.selected_user_id,
            payment: null,
         },
      })
         .then(res => {
            // if (selected_book.model_name == "customer-paid-audio-books") {
            //    set_paid_audio_books([...paid_audio_books, res.data])
            // }
            // if (selected_book.model_name == "customer-paid-ebooks") {
            //    set_paid_online_books([...paid_online_books, res.data])
            // }

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
   }

   async function deleteUserBoughtBook() {
      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/${selected_book.model_name}?book.id=${selected_book.id}&users_permissions_user.id=${props.selected_user_id}`,
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(async res => {
            console.log(res.data)
            let delete_payment_ids = res.data.map(d => d.id)
            console.log(delete_payment_ids)
            await axios
               .all(
                  delete_payment_ids.map(id => {
                     axios({
                        url: `${process.env.REACT_APP_STRAPI_BASE_URL}/${selected_book.model_name}/${id}`,
                        method: "DELETE",
                        headers: {
                           Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
                        },
                     })
                  })
               )
               .catch(err => {
                  throw "error on deletion"
               })
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
   }

   async function fetchData() {
      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books`,
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(res => {
            set_books(res.data)
         })
         .catch(err => {
            props.setIsNetworkError(true)
         })
      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/customer-paid-ebooks?users_permissions_user.id=${props.selected_user_id}`,
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(book => {
            set_paid_online_books(book.data)
         })
         .catch(err => {
            props.setIsNetworkError(true)
         })

      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/customer-paid-audio-books?users_permissions_user.id=${props.selected_user_id}`,
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(book => {
            set_paid_audio_books(book.data)
         })
         .catch(err => {
            props.setIsNetworkError(true)
         })

      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/customer-paid-books?users_permissions_user.id=${props.selected_user_id}`,
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(paidBook => {
            set_paid_books(paidBook.data)
         })
         .catch(err => {
            props.setIsNetworkError(true)
         })
   }

   useEffect(() => {
      initialState()
   }, [books, paid_online_books, paid_books])

   useEffect(() => {
      fetchData()
   }, [])

   return (
      <React.Fragment>
         <Modal
            size="xl"
            isOpen={props.modal_toggle}
            toggle={() => {
               props.set_modal_toggle(!props.modal_toggle)
            }}
            centered={true}
         >
            <div className="modal-header">
               <h5 className="modal-title mt-0">
                  <strong>Худалдан авалтууд</strong>
               </h5>
               <button
                  onClick={() => {
                     props.set_modal_toggle(false)
                  }}
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
               >
                  <span aria-hidden="true">&times;</span>
               </button>
            </div>
            <div className="modal-body">
               <MDBDataTable striped bordered data={table_data} noBottomColumns noRecordsFoundLabel={"Номын дугаар байхгүй"} infoLabel={["", "-ээс", "дахь ном. Нийт", ""]} entries={5} entriesOptions={[5, 10, 20]} paginationLabel={["Өмнөх", "Дараах"]} searchingLabel={"Хайх"} searching />
            </div>
         </Modal>

         {confirm_allow_ebooks ? (
            <SweetAlert
               title="Та хэрэглэгчид номын эрх нээх гэж байна. Итгэлтэй байна уу ?"
               warning
               showCancel
               confirmBtnText="Тийм"
               cancelBtnText="Болих"
               confirmBtnBsStyle="success"
               cancelBtnBsStyle="danger"
               onConfirm={() => {
                  set_confirm_allow_ebooks(false)
                  set_state({ loading: true })
                  givePermissionToCustomer()
               }}
               onCancel={() => {
                  set_confirm_allow_ebooks(false)
               }}
            ></SweetAlert>
         ) : null}
      </React.Fragment>
   )

   function noticeIsBoughtBook(book_id) {
      if (paid_books.filter(paid_book => book_id == paid_book.book?.id).length != 0) return true
      return false
   }

   function noticeIsBoughtEbook(book_id) {
      if (paid_online_books.filter(paid_book => book_id == paid_book.book?.id).length != 0) return true
      return false
   }

   function noticeIsBoughtAudioBook(book_id) {
      if (paid_audio_books.filter(paid_book => book_id == paid_book.book?.id).length != 0) return true
      return false
   }
}

export default GivePermission
