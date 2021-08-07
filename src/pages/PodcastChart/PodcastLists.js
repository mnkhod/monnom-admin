import React, { useState, useEffect, useMemo, useContext } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, CardTitle, CardImg, CardText, Row, Pagination, PaginationItem, PaginationLink } from "reactstrap"
import axios from "axios"
import { ResultPopUp } from "../../contexts/CheckActionsContext"
import { isEmpty } from "lodash"

const ContactsGrid = props => {
   const [state, set_state] = useContext(ResultPopUp)

   const [data, set_data] = useState([])
   const ITEMS_PER_PAGE = 16

   const [confirm_allow, set_confirm_allow] = useState(false)
   const [are_you_sure_title, set_are_you_sure_title] = useState("")
   const [channel_info_to_update, set_channel_info_to_update] = useState({ id: null, state: null })

   const [searchFilter, setSearchFilter] = useState('')
   const [showPaginationIndex, setShowPaginationIndex] = useState(0)
   const [showPodcastIndex, setShowPodcastIndex] = useState(0)

   async function featurePodcastChannel() {
      await axios({
         url: `${process.env.REACT_APP_STRAPI_BASE_URL}/podcast-channels/${channel_info_to_update.id}`,
         method: "PUT",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
         data: {
            is_featured: !channel_info_to_update.state,
         },
      })
         .then(res => {
            set_state({ loading: false })
            set_state({ success: true })
            let tempChannels = Object.assign(data)
            tempChannels.find(channel => channel.id === res.data.id).is_featured = res.data.is_featured
         })
         .catch(err => {
            set_state({ loading: false })
            set_state({ error: true })
         })
   }

   useEffect(() => {
      set_data(props.podcast.podcastChannels)
   }, [])

   const visiblePodcasts = useMemo(() => {

      let temp = data

      if (searchFilter !== '') {

         temp = data.filter((p) => {
            let found = false

            if (p != null && p.podcast_name.toUpperCase().includes(searchFilter.toUpperCase())) found = true

            return found
         })
      }

      return temp
      
   }, [data, searchFilter])

   const showPodcasts = useMemo(() => {
      let result =  []
      let temp = []
      let count = 0
      let counts = 0

      visiblePodcasts.forEach((podcast) => {
         if (count == ITEMS_PER_PAGE) {
            count = 1
            result.push(temp)
            temp = []
            temp.push(podcast)
         } else {
            temp.push(podcast)
            count += 1
         }

         counts += 1
      })

      result.push(temp)

      return result
      
   }, [visiblePodcasts])

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
                           setSearchFilter(event.target.value)
                        }}
                     />
                     <span className="bx bx-search-alt" />
                  </div>
               </form>
            </Col>

            <Col lg={4}>
               <Pagination className="pagination pagination-rounded d-flex justify-content-end mb-2">
                  <PaginationItem disabled={showPaginationIndex == 0}>
                     <PaginationLink
                        previous
                        href="#"
                        onClick={() => {
                           setShowPodcastIndex(showPodcastIndex - 1),
                           setShowPaginationIndex(showPaginationIndex - 1)
                        }}
                     />
                  </PaginationItem>
                  {showPodcasts.length > 6 
                     ? showPodcasts.slice(showPaginationIndex, showPaginationIndex + 5).map((item, i) => (
                        <PaginationItem active={i + showPaginationIndex == showPodcastIndex} key={i}>
                           <PaginationLink
                              onClick={() => setShowPodcastIndex(showPaginationIndex + i)}
                              href="#"
                           >
                              {i + showPaginationIndex + 1}
                           </PaginationLink>
                        </PaginationItem>
                     )) 
                     : showPodcasts.map((item, i) => (
                        <PaginationItem active={i == showPodcastIndex} key={i}>
                           <PaginationLink
                              onClick={() => setShowPodcastIndex(i)}
                              href="#"
                           >
                              {i+1}
                           </PaginationLink>
                        </PaginationItem>
                     )) 
                  }
                  <PaginationItem disabled={showPodcasts.length > 6 ? showPaginationIndex == showPodcasts.length - 5 : showPodcastIndex == showPodcasts.length - 1}>
                     <PaginationLink
                        next
                        href="#"
                        onClick={() => {
                           setShowPodcastIndex(showPodcastIndex + 1)
                           setShowPaginationIndex(showPaginationIndex + 1)
                        }}
                     />
                  </PaginationItem>
               </Pagination>
            </Col>
         </Row>

         <Row>
            {!isEmpty(data) && 
               (showPodcasts[showPodcastIndex] || []).map((podcast) => (
                  <Col key={podcast.id} xl={3} lg={4} md={4} sm={4} xs={6}>
                     <Card>
                        <CardImg
                           top
                           src={podcast.podcast_pic_url}
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
                                    <b>{new Date(podcast.podcast_added_date).toLocaleDateString()}</b>
                                 </Col>
                              </Row>
                              <Row className="mt-2">
                                 <Col xl={6} className="text-left">
                                    Нийтлэгч:
                                 </Col>
                                 <Col xl={6} className="text-right">
                                    <b>{podcast.podcast_author?.firstname?.slice(0, 14)}</b>
                                 </Col>
                              </Row>
                           </CardText>
                           <Row>
                              <Col xl={6} className="text-left">
                                 <Link to={"/podcastSingle/" + podcast.id} className="btn btn-primary waves-effect waves-light">
                                    Дэлгэрэнгүй
                                 </Link>
                              </Col>
                              <Col xl={6} className="text-right d-flex align-items-center justify-content-center">
                                 <div class="custom-control custom-checkbox">
                                    <input
                                       type="checkbox"
                                       class="custom-control-input"
                                       id={`customCheck1-${podcast.id}`}
                                       onClick={() => {
                                          if (podcast.is_featured) {
                                             set_are_you_sure_title(`${podcast.podcast_name} сувгийг онцлох сувгаас хасах гэж байна. Та итгэлтэй байна уу?`)
                                          } else {
                                             set_are_you_sure_title(`${podcast.podcast_name} сувгийг онцлох суваг болгох гэж байна. Та итгэлтэй байна уу?`)
                                          }
                                          set_channel_info_to_update({
                                             id: podcast.id,
                                             state: podcast.is_featured,
                                          })
                                          set_confirm_allow(true)
                                       }}
                                       checked={podcast.is_featured}
                                    />
                                    <label class="custom-control-label" for={`customCheck1-${podcast.id}`}>
                                       Онцлох
                                    </label>
                                 </div>
                              </Col>
                           </Row>
                        </CardBody>
                     </Card>
                  </Col>
               ))
            }
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
                  set_state({ loading: true })
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
