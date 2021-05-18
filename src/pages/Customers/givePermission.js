import React, { useEffect, useState } from "react"
import { Badge, Modal } from "reactstrap"

import axios from "axios"
import { MDBDataTable } from "mdbreact"
import { Link } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"

require("dotenv").config()

const columns = [
  {
    label: "Нэр",
    field: "name",
    sort: "asc",
    width: 150,
  },
  {
    label: "Төрөл",
    field: "type",
    sort: "asc",
    width: 100,
  },
  {
    label: "Онлайн худалдан авалт",
    field: "online_books_order",
    sort: "disabled",
    width: 60,
  },
  {
    label: "Биет худалдан авалт",
    field: "physical_books_order",
    sort: "disabled",
    width: 60,
  },
]

const GivePermission = props => {
  const [books, set_books] = useState([])
  const [book_data, set_book_data] = useState([])
  const [paid_online_books, set_paid_online_books] = useState([])
  const [paid_books, set_paid_books] = useState([])
  const [confirm_allow, set_confirm_allow] = useState(false)
  const [success_dialog, setsuccess_dialog] = useState(false)
  const [error_dialog, seterror_dialog] = useState(false)
  const [loading_dialog, set_loading_dialog] = useState(false)
  const [selected_book_id, set_selected_book_id] = useState(null)

  const table_data = {
    columns: columns,
    rows: book_data,
  }

  const initialState = () => {
    let tempCols = books.map(book => {
      return {
        name: book.name,
        type: (
          <Link className="d-flex justify-content-around align-items-center">
            <i
              style={{ color: book.has_sale ? "#24ea75" : "#767676" }}
              className="bx bxs-book-open font-size-20"
            />
            <i
              style={{ color: book.has_mp3 ? "#fe2379" : "#767676" }}
              className="bx bxs-music font-size-20"
            />
            <i
              style={{ color: book.has_pdf ? "#ffd722" : "#767676" }}
              className="bx bxs-file-pdf font-size-20"
            />
          </Link>
        ),
        physical_books_order: (
          <Badge
            color={noticeIsBought(book.id) ? "success" : "primary"}
            className="mr-1 font-size-13"
          >
            <strong>
              {noticeIsBought(book.id) ? "Худалдаж авсан" : "Худалдаж аваагүй"}
            </strong>
          </Badge>
        ),
        online_books_order: (
          <Badge
            color={noticeIsBoughtEbook(book.id) ? "success" : "primary"}
            className="mr-1 font-size-13"
          >
            <strong
              onClick={() => {
                if (!noticeIsBoughtEbook(book.id)) {
                  set_selected_book_id(book.id)
                  set_confirm_allow(true)
                }
              }}
              style={{
                cursor: noticeIsBoughtEbook(book.id) ? "" : "pointer",
              }}
            >
              {noticeIsBoughtEbook(book.id)
                ? "Худалдаж авсан"
                : "Худалдаж аваагүй"}
            </strong>
          </Badge>
        ),
      }
    })
    set_book_data(tempCols)
  }

  async function givePermissionToCustomer() {
    if (selected_book_id == null || props.selected_user_id == null) {
      seterror_dialog(true)
      return
    }

    await axios({
      url: `${process.env.REACT_APP_STRAPI_BASE_URL}/customer-paid-ebooks`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
      data: {
        book: selected_book_id,
        users_permissions_user: props.selected_user_id,
      },
    })
      .then(res => {
        set_loading_dialog(false)
        set_paid_online_books([...paid_online_books, res.data])
        setsuccess_dialog(true)
      })
      .catch(err => {
        set_loading_dialog(false)
        seterror_dialog(true)
      })
  }

  async function fetchData() {
    await axios({
      url: `${process.env.REACT_APP_STRAPI_BASE_URL}/books`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
    })
      .then(res => {
        set_books(res.data)
      })
      .catch(err => {
        props.setIsNetworking(true)
      })
    await axios({
      url: `${process.env.REACT_APP_STRAPI_BASE_URL}/customer-paid-ebooks?users_permissions_user.id=${props.selected_user_id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
    })
      .then(book => {
        set_paid_online_books(book.data)
      })
      .catch(err => {
        props.setIsNetworking(true)
      })

    await axios({
      url: `${process.env.REACT_APP_STRAPI_BASE_URL}/customer-paid-books?users_permissions_user.id=${props.selected_user_id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
    })
      .then(paidBook => {
        set_paid_books(paidBook.data)
      })
      .catch(err => {
        props.setIsNetworking(true)
      })
  }

  useEffect(() => {
    initialState()
  }, [books, paid_online_books, paid_books])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
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
          <MDBDataTable
            proSelect
            responsive
            striped
            bordered
            data={table_data}
            proSelect
            noBottomColumns
            noRecordsFoundLabel={"Номын дугаар байхгүй"}
            infoLabel={["", "-ээс", "дахь ном. Нийт", ""]}
            entries={5}
            entriesOptions={[5, 10, 20]}
            paginationLabel={["Өмнөх", "Дараах"]}
            searchingLabel={"Хайх"}
            searching
          />
        </div>
      </Modal>
      {loading_dialog ? (
        <SweetAlert
          title="Түр хүлээнэ үү"
          info
          showCloseButton={false}
          showConfirm={false}
          success
        ></SweetAlert>
      ) : null}
      {confirm_allow ? (
        <SweetAlert
          title="Та хэрэглэгчид номын эрх нээх гэж байна. Итгэлтэй байна уу ?"
          warning
          showCancel
          confirmBtnText="Тийм"
          cancelBtnText="Болих"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            set_confirm_allow(false)
            set_loading_dialog(true)
            givePermissionToCustomer()
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
            setsuccess_dialog(false)
          }}
        >
          {"Хэрэглэгчид эрх олгогдлоо"}
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
          {"Эрх олгох үйлдэл амжилтгүй боллоо"}
        </SweetAlert>
      ) : null}
    </>
  )

  function noticeIsBought(book_id) {
    if (
      paid_books.filter(paid_book => book_id == paid_book.book?.id).length != 0
    )
      return true
    return false
  }

  function noticeIsBoughtEbook(book_id) {
    if (
      paid_online_books.filter(paid_book => book_id == paid_book.book?.id)
        .length != 0
    )
      return true
    return false
  }
}

export default GivePermission
