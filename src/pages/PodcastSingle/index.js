import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import PodcastDetail from "./PodcastDetail"
import { Alert, Row, Col } from "reactstrap"
import { Link } from "react-router-dom"
import Breadcrumb from "../../components/Common/Breadcrumb"

require("dotenv").config()

const PodcastSinglePage = () => {
  const { id } = useParams()
  const [data, set_data] = useState(null)

  // Check network
  const [isNetworkingError, setIsNetworkingError] = useState(false)
  const [isNetworkLoading, SetIsNetworkLoading] = useState(false)

  async function fetchData() {
    await axios({
      url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/podcast-channels/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
    })
      .then(res => {
        set_data(res.data)
        setIsNetworkingError(false)
        SetIsNetworkLoading(true)
      })
      .catch(err => {
        setIsNetworkingError(false)
        SetIsNetworkLoading(true)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumb breadcrumbItem="Подкаст дэлгэрэнгүй" title="Подкаст" />
        {isNetworkingError ? (
          <Alert color="danger" role="alert">
            Сүлжээ уналаа ! Дахин ачааллна уу ?
          </Alert>
        ) : (
          <>
            {isNetworkLoading && data != null ? (
              <PodcastDetail channel={data} set_data={set_data} />
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

export default PodcastSinglePage
