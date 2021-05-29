import React, { useState, useEffect, useContext } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Col,
  CardTitle,
  CardImg,
  CardText,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap"
import axios from "axios"
import { ResultPopUp } from "../../contexts/CheckActionsContext"

const ContactsGrid = props => {
  const [state, set_state] = useContext(ResultPopUp)
  
  const [data, set_data] = useState([])
  const ITEMS_PER_PAGE = 12

  const [searchItms, setSearchItms] = useState("")
  const [confirm_allow, set_confirm_allow] = useState(false)
  const [pagination_current, set_pagination_current] = useState(1)
  const [pagination_pages, set_pagination_pages] = useState([])
  const [are_you_sure_title, set_are_you_sure_title] = useState("")
  const [channel_info_to_update, set_channel_info_to_update] = useState({
    id: null,
    state: null,
  })

  async function featurePodcastChannel() {
    await axios({
      url: `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-channels/${channel_info_to_update.id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
      data: {
        is_featured: !channel_info_to_update.state,
      },
    })
      .then(res => {
        set_state({loading: false})
        set_state({success: true})
        let tempChannels = Object.assign(data)
        tempChannels.find(channel => channel.id === res.data.id).is_featured =
          res.data.is_featured
      })
      .catch(err => {
        set_state({loading: false})
        set_state({error: true})
      })
  }

  useEffect(() => {
    set_data(props.podcast.podcastChannels)
    let tempPaginations = []
    for (let i = 1; i <= Math.ceil(props.podcast.podcastChannels.length / ITEMS_PER_PAGE); i++) {
      tempPaginations.push(i)
    }
    set_pagination_pages(tempPaginations)
  }, [])

  return (
    <React.Fragment>
      <Row>
        <Col lg={4}></Col>

        <Col xl={4} lg={6} md={8} xs={8} sm={8}>
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

        <Col lg={4}>
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
                onClick={() => set_pagination_current(pagination_current + 1)}
              >
                <i className="mdi mdi-chevron-right" />
              </PaginationLink>
            </PaginationItem>
          </Pagination>
        </Col>
      </Row>

      <Row>
        {data
          ? data
              .filter(val => {
                if (searchItms === "") {
                  return val
                } else if (
                  val.podcast_name
                    .toLocaleLowerCase()
                    .includes(searchItms.toLocaleLowerCase())
                ) {
                  return val
                }
              })

              .map(podcast => {
                try {
                  if (
                    podcast.pagination_number <=
                      pagination_current * ITEMS_PER_PAGE &&
                    podcast.pagination_number >
                      pagination_current * ITEMS_PER_PAGE - ITEMS_PER_PAGE
                  )
                    return (
                      <Col xl={3} lg={4} md={4} sm={4} xs={6}>
                        <Card>
                          <CardImg
                            top
                            src={
                              process.env.REACT_APP_STRAPI_BASE_URL +
                              podcast.podcast_pic_url
                            }
                            alt={podcast.podcast_name}
                            className="img-fluid mx-auto"
                            style={{
                              width: "98%",
                              height: "30vh",
                              overflow: "visible",
                            }}
                          />
                          <CardBody>
                            <CardTitle className="mt-0 d-flex">
                              <h3 className="mr-2">
                                {podcast.podcast_name.slice(0, 30)}
                                {podcast.pagination_number}
                              </h3>
                              <h3>- {podcast.episode_count}</h3>
                            </CardTitle>
                            <CardText>
                              <Row>
                                <Col xl={6} className="text-left">
                                  Нэмэгдсэн огноо:
                                </Col>
                                <Col xl={6} className="text-right">
                                  <b>
                                    {new Date(
                                      podcast.podcast_added_date
                                    ).toLocaleDateString()}
                                  </b>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col xl={6} className="text-left">
                                  Нийтлэгч:
                                </Col>
                                <Col xl={6} className="text-right">
                                  <b>
                                    {podcast.podcast_author?.firstname?.slice(
                                      0,
                                      14
                                    )}
                                  </b>
                                </Col>
                              </Row>
                            </CardText>
                            <Row>
                              <Col xl={6} className="text-left">
                                <Link
                                  to={"/podcastSingle/" + podcast.id}
                                  className="btn btn-primary waves-effect waves-light"
                                >
                                  Дэлгэрэнгүй
                                </Link>
                              </Col>
                              <Col
                                xl={6}
                                className="text-right d-flex align-items-center justify-content-center"
                              >
                                <div class="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    class="custom-control-input"
                                    id={`customCheck1-${podcast.id}`}
                                    onClick={() => {
                                      if (podcast.is_featured) {
                                        set_are_you_sure_title(
                                          `${podcast.podcast_name} сувгийг онцлох сувгаас хасах гэж байна. Та итгэлтэй байна уу?`
                                        )
                                      } else {
                                        set_are_you_sure_title(
                                          `${podcast.podcast_name} сувгийг онцлох суваг болгох гэж байна. Та итгэлтэй байна уу?`
                                        )
                                      }
                                      set_channel_info_to_update({
                                        id: podcast.id,
                                        state: podcast.is_featured,
                                      })
                                      set_confirm_allow(true)
                                    }}
                                    checked={podcast.is_featured}
                                  />
                                  <label
                                    class="custom-control-label"
                                    for={`customCheck1-${podcast.id}`}
                                  >
                                    Онцлох
                                  </label>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    )
                } catch (e) {
                }
              })
          : null}
      </Row>

      {confirm_allow ? (
        <SweetAlert
          title={are_you_sure_title}
          info
          showCancel
          confirmBtnText="Тийм"
          cancelBtnText="Болих"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            set_confirm_allow(false)
            set_state({loading: true})
            featurePodcastChannel()
          }}
          onCancel={() => {
            set_are_you_sure_title("")
            set_confirm_allow(false)
          }}
        ></SweetAlert>
      ) : null}
    </React.Fragment>
  )
}

export default ContactsGrid
