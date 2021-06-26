import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Breadcrumb from "../../components/Common/Breadcrumb"
import { Link } from "react-router-dom"
import { Alert, Row, Col } from "reactstrap"
import MetaTags from "react-meta-tags"

import BookDetail from "./BookDetail"

require("dotenv").config()

const BookAuthor = () => {
   const { id } = useParams()
   const [data, set_data] = useState(null)

   // Check network
   const [isNetworkError, setIsNetworkError] = useState(false)
   const [isNetworkLoading, SetIsNetworkLoading] = useState(false)

   async function fetchData() {
      await axios({
         url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/book-single-by-author/${id}`,
         method: "GET",
         headers: {
            Authorization: `${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(res => {
            set_data(res.data)
            SetIsNetworkLoading(true)
            setIsNetworkError(false)
         })
         .catch(err => {
            console.log(err)
            setIsNetworkError(true)
            SetIsNetworkLoading(true)
         })
   }

   useEffect(() => {
      fetchData()
   }, [])

   return (
      <React.Fragment>
         <div className="page-content">
            <MetaTags>
               <title>Ном</title>
            </MetaTags>
            {isNetworkError ? (
               <Alert color="danger" role="alert">
                  Сүлжээ уналаа ! Дахин ачааллна уу ?
               </Alert>
            ) : (
               <>
                  {isNetworkLoading ? (
                     <React.Fragment>
                        <Breadcrumb breadcrumbItem="Ном дэлгэрэнгүй" title="Ном" />
                        <BookDetail user={data} />
                     </React.Fragment>
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
         </div>
      </React.Fragment>
   )
}

export default BookAuthor
