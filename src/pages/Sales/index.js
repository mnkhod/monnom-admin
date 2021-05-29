import React, { useState, useEffect } from "react"
import axios from "axios"
import Breadcrumb from "../../components/Common/Breadcrumb"
import { Alert, Row, Col } from "reactstrap"
import { Link } from "react-router-dom"

import SalesList from "./List"

const Sales = () => {
  const [ebook_data, set_ebook_data] = useState([])
  const [book_data, set_book_data] = useState([])

  // Check network
  const [isNetworkError, setIsNetworkError] = useState(false)
  const [isNetworkLoading, SetIsNetworkLoading] = useState(true)

  async function fetchEbookData() {
    try {
      let books = await axios({
        url: `${process.env.REACT_APP_STRAPI_BASE_URL}/customer-paid-books`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user_information")).jwt
          }`,
        },
      }).catch(err => {
        throw "error"
      })

      let ebooks = await axios({
        url: `${process.env.REACT_APP_STRAPI_BASE_URL}/customer-paid-ebooks`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user_information")).jwt
          }`,
        },
      }).catch(err => {
        throw "error"
      })

      set_book_data(books.data)
      set_ebook_data(ebooks.data)

      SetIsNetworkLoading(false)
      setIsNetworkError(false)
    } catch (error) {
      SetIsNetworkLoading(false)
      setIsNetworkError(true)
    }
  }

  function division(allBooks) {
    let ebooks = []
    let books = []

    {
      allBooks.forEach(book => {
        if (book.book.has_audio || book.book.has_pdf) {
          ebooks.push(book)
        }
        if (book.book.has_sale) {
          books.push(book)
        }
      })
    }

    set_book_data(books)
    set_ebook_data(ebooks)
  }

  useEffect(() => {
    fetchEbookData()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumb breadcrumbItem="Борлуулатын мэдээлэл" title="Борлуулалт" />
        {isNetworkError ? (
          <Alert color="danger" role="alert">
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
            ) : book_data.length != 0 && ebook_data.length != 0 ? (
              <SalesList books={book_data} ebooks={ebook_data} />
            ) : (
              []
            )}
          </>
        )}
      </div>
    </React.Fragment>
  )
}

export default Sales
