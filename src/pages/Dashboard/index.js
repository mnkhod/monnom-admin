import React, { useState, useEffect } from "react"
import { Container, Alert } from "reactstrap"
import { Link } from "react-router-dom"
import MetaTags from "react-meta-tags"

import IncomeInformation from "./IncomeInformation"
import Accessions from "./Accessions"
import AccessByGender from "./AccesByGender"
import AccessPeriod from "./AccessPeriod"

import MostPopularPodcast from "./MostPopularPodcast"
import MostPopularBook from "./MostPopularBook"

import { Row, Col, Card, CardBody, CardTitle, Media } from "reactstrap"
import axios from "axios"

const Dashboard = () => {
   const [data, set_data] = useState(null)

   const [isNetworkingError, setIsNetworkingError] = useState(false)
   const [isNetworkLoading, SetIsNetworkLoading] = useState(true)

   const [totalPodcastChannels, set_totalPodcastChannels] = useState({
      title: "Нийт Подкастын сувгууд",
      iconClass: "bx bx-play-circle",
      description: 0,
   })

   const [totalPodcastFollows, set_totalPodcastFollows] = useState({
      title: "Нийт Подкастын дагагчид",
      iconClass: "bx bx-user",
      description: 0,
   })

   const [totalRadioChannels, set_totalRadioChannels] = useState({
      title: "Нийт Радио сувгууд",
      iconClass: "bx bx-bullseye",
      description: 0,
   })

   const [totalAudioBooks, set_totalAudioBooks] = useState({
      title: "Нийт Аудио Ном",
      iconClass: "bx bx-headphone",
      description: 0,
   })

   const [totalEBooks, set_totalEBooks] = useState({
      title: "Нийт Ай Бүүк",
      iconClass: "bx bxs-file-blank",
      description: 0,
   })

   const [totalBooks, set_totalBooks] = useState({
      title: "Нийт Ном",
      iconClass: "bx bx-wifi-0",
      description: 0,
   })

   const initializeData = data => {
      set_totalPodcastChannels(prevState => ({
         ...prevState,
         description: data.totalPodcastChannels,
      }))
      set_totalPodcastFollows(prevState => ({
         ...prevState,
         description: data.totalPodcastFollows,
      }))
      set_totalRadioChannels(prevState => ({
         ...prevState,
         description: data.totalRadioChannels,
      }))
      set_totalAudioBooks(prevState => ({
         ...prevState,
         description: data.totalAudioBooks,
      }))
      set_totalEBooks(prevState => ({
         ...prevState,
         description: data.totalEBooks,
      }))
      set_totalBooks(prevState => ({
         ...prevState,
         description: data.totalBooks,
      }))
   }

   const fetchData = async () => {
      await axios({
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
         url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/dashboard`,
      })
         .then(res => {
            SetIsNetworkLoading(false)
            setIsNetworkingError(false)

            set_data(res.data)
            initializeData(res.data)
         })

         .catch(err => {
            SetIsNetworkLoading(false)
            setIsNetworkingError(true)
         })
   }

   useEffect(() => {
      fetchData()
   }, [])

   const testQPayAuthorization = () => {
      axios
         .post(
            "https://merchant-sandbox.qpay.mn/v2/auth/token",
            {},
            {
               auth: {
                  username: "TEST_MERCHANT",
                  password: "123456",
               },
            }
         )
         .then(res => {})
         .catch(err => {})
   }

   return (
      <React.Fragment>
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css" />
         <div className="page-content">
         <MetaTags>
           <title>Хянах самбар</title>
         </MetaTags>
            <button
               onClick={() => {
                  testQPayAuthorization()
               }}
            >
               test qpay authorization
            </button>
            {isNetworkingError ? (
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
                  ) : (
                     <Container fluid>
                        <Row>
                           <Col lg={4} md={6} xs={6}>
                              <Card className="mini-stats-wid">
                                 <CardBody>
                                    <Media>
                                       <Media body>
                                          <p className="text-muted font-weight-medium">{totalPodcastChannels.title}</p>
                                          <h4 className="mb-0">{totalPodcastChannels.description}</h4>
                                       </Media>
                                       <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                                          <span className="avatar-title">
                                             <i className={"bx " + totalPodcastChannels.iconClass + " font-size-24"}></i>
                                          </span>
                                       </div>
                                    </Media>
                                 </CardBody>
                              </Card>
                           </Col>

                           <Col lg={4} md={6} xs={6}>
                              <Card className="mini-stats-wid">
                                 <CardBody>
                                    <Media>
                                       <Media body>
                                          <p className="text-muted font-weight-medium">{totalPodcastFollows.title}</p>
                                          <h4 className="mb-0">{totalPodcastFollows.description}</h4>
                                       </Media>
                                       <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                                          <span className="avatar-title">
                                             <i className={"bx " + totalPodcastFollows.iconClass + " font-size-24"}></i>
                                          </span>
                                       </div>
                                    </Media>
                                 </CardBody>
                              </Card>
                           </Col>

                           <Col lg={4} md={6} xs={6}>
                              <Card className="mini-stats-wid">
                                 <CardBody>
                                    <Media>
                                       <Media body>
                                          <p className="text-muted font-weight-medium">{totalRadioChannels.title}</p>
                                          <h4 className="mb-0">{totalRadioChannels.description}</h4>
                                       </Media>
                                       <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                                          <span className="avatar-title">
                                             <i className={"bx " + totalRadioChannels.iconClass + " font-size-24"}></i>
                                          </span>
                                       </div>
                                    </Media>
                                 </CardBody>
                              </Card>
                           </Col>

                           <Col lg={4} md={6} xs={6}>
                              <Card className="mini-stats-wid">
                                 <CardBody>
                                    <Media>
                                       <Media body>
                                          <p className="text-muted font-weight-medium">{totalAudioBooks.title}</p>
                                          <h4 className="mb-0">{totalAudioBooks.description}</h4>
                                       </Media>
                                       <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                                          <span className="avatar-title">
                                             <i className={"bx " + totalAudioBooks.iconClass + " font-size-24"}></i>
                                          </span>
                                       </div>
                                    </Media>
                                 </CardBody>
                              </Card>
                           </Col>

                           <Col lg={4} md={6} xs={6}>
                              <Card className="mini-stats-wid">
                                 <CardBody>
                                    <Media>
                                       <Media body>
                                          <p className="text-muted font-weight-medium">{totalEBooks.title}</p>
                                          <h4 className="mb-0">{totalEBooks.description}</h4>
                                       </Media>
                                       <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                                          <span className="avatar-title">
                                             <i className={"bx " + totalEBooks.iconClass + " font-size-24"}></i>
                                          </span>
                                       </div>
                                    </Media>
                                 </CardBody>
                              </Card>
                           </Col>

                           <Col lg={4} md={6} xs={6}>
                              <Card className="mini-stats-wid">
                                 <CardBody>
                                    <Media>
                                       <Media body>
                                          <p className="text-muted font-weight-medium">{totalBooks.title}</p>
                                          <h4 className="mb-0">{totalBooks.description}</h4>
                                       </Media>
                                       <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                                          <span className="avatar-title">
                                             <i className={"bx " + totalBooks.iconClass + " font-size-24"}></i>
                                          </span>
                                       </div>
                                    </Media>
                                 </CardBody>
                              </Card>
                           </Col>
                        </Row>
                        <Row>
                           <Col lg={6}>
                              <Card>
                                 <CardBody>
                                    <CardTitle className="mb-4">Хэрэглэгчид (насаар)</CardTitle>
                                    {data != null ? <Accessions userByAge={data.usersByAge} /> : null}
                                 </CardBody>
                              </Card>
                           </Col>
                           {/* <Col lg={6}>
                    <Card>
                      <CardBody>
                        <CardTitle className="mb-4">
                          Цахим номын борлуулалт
                        </CardTitle>
                        <AccessPeriod />
                      </CardBody>
                    </Card>
                  </Col> */}
                           <Col lg={6}>
                              <Card>
                                 <CardBody>
                                    <CardTitle className="mb-4">Хэрэглэгчид (хүйсээр)</CardTitle>
                                    {data != null ? <AccessByGender acces_by_gender={data.usersByGender} /> : null}
                                 </CardBody>
                              </Card>
                           </Col>
                           {/* <Col lg={6}>
                    <Card>
                      <CardBody>
                        <CardTitle className="mb-4">
                          Хэвлэмэл номын борлуулалт
                        </CardTitle>
                        <IncomeInformation />
                      </CardBody>
                    </Card>
                  </Col> */}
                           <Col lg={5} md={12}>
                              {data != null ? <MostPopularPodcast mostFollowedPodcastChannels={data.mostFollowedPodcastChannels} /> : null}
                           </Col>
                           <Col lg={7} md={12}>
                              {data != null ? <MostPopularBook data={data} /> : null}
                              <MostPopularBook />
                           </Col>
                        </Row>
                     </Container>
                  )}
               </>
            )}
         </div>
      </React.Fragment>
   )
}

export default Dashboard
