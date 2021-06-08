import React, { useEffect, useMemo, useState } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Container, Col, Row, Card, CardImg, CardBody, CardTitle, CardText, Pagination, PaginationItem, PaginationLink, Button } from "reactstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import "../../assets/scss/custom/components/_blog.scss"

import MetaTags from "react-meta-tags"

const PAGINATION = 12

const BlogsList = () => {
   const [blogs, setBlogs] = useState([])
   const [paginationPages, setPaginationPages] = useState([1])
   const [paginationCurrent, setPaginationCurrent] = useState(1)
   const [search, setSearch] = useState("")
   const [visibleBlogs, setVisibleBlogs] = useState([])

   // Check network
   const [isNetworkError, setIsNetworkError] = useState(false)
   const [isNetworkLoading, SetIsNetworkLoading] = useState(true)

   // idx [1; b]
   const paginate = async (idx, limit) => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      const start = (idx - 1) * PAGINATION
      const blogResponse = await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}/blogs?_sort=id:DESC&_start=${start}&_limit=${limit}`, config)
      const blogs = blogResponse.data
      const countResponse = await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}/blogs/count`, config)
      let paginationPages = []
      const pageCount = Math.ceil(countResponse.data / PAGINATION)
      for (let i = 1; i <= pageCount; i++) {
         paginationPages.push(i)
      }
      setPaginationPages(paginationPages)
      setPaginationCurrent(idx)
      setBlogs(blogs)
      setVisibleBlogs(blogs)
   }

   const refreshBlogs = async () => {
      paginate(1, PAGINATION)
   }
   useEffect(() => {
      refreshBlogs()
   }, [])

   const handleSearch = async search => {
      setSearch(search)
      if (!search || search.length == 0) {
         return
      }
      const response = await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}/blogs?_where[title_contains]=${search}&_sort=id:DESC`)
      const result = response.data
      setVisibleBlogs(result)
   }

   return (
      <React.Fragment>
         <div className="page-content">
            <MetaTags>
               <title>Мэдээ мэдээлэл</title>
            </MetaTags>
            <Container fluid>
               <Breadcrumbs title="Мэдээ мэдээлэл" breadcrumbItem="Мэдээ мэдээллийн жагсаалт" />
               {isNetworkError ? (
                  <Alert color="danger" role="alert">
                     Сүлжээ уналаа ! Дахин ачааллна уу ?
                  </Alert>
               ) : (
                  <>
                     {isNetworkLoading && visibleBlogs.length == 0 ? (
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
                        <>
                           <Row>
                              <Col lg={4}>
                                 <Link to="/blog">
                                    <Button color="primary">Мэдээ нэмэх</Button>
                                 </Link>
                              </Col>
                              <Col xl={4} lg={4} md={6} xs={6} sm={6}></Col>
                              <Col lg={3}>
                                 <Pagination style={{ backgroundColor: "red" }} aria-label="Page navigation example" className="d-flex justify-content-end mt-3">
                                    <PaginationItem
                                       disabled={paginationCurrent == 1}
                                       onClick={() => {
                                          paginate(Math.max(paginationCurrent - 1, 1), PAGINATION)
                                       }}
                                    >
                                       <PaginationLink>
                                          <i className="mdi mdi-chevron-left" />
                                       </PaginationLink>
                                    </PaginationItem>
                                    {paginationPages.map(page => (
                                       <PaginationItem
                                          onClick={() => {
                                             paginate(page, PAGINATION)
                                          }}
                                          active={page == paginationCurrent}
                                       >
                                          <PaginationLink href="#">{page}</PaginationLink>
                                       </PaginationItem>
                                    ))}
                                    <PaginationItem
                                       disabled={paginationCurrent == paginationPages[paginationPages.length - 1]}
                                       onClick={() => {
                                          paginate(Math.min(paginationCurrent + 1, paginationPages.length), PAGINATION)
                                       }}
                                    >
                                       <PaginationLink>
                                          <i className="mdi mdi-chevron-right" />
                                       </PaginationLink>
                                    </PaginationItem>
                                 </Pagination>
                              </Col>
                           </Row>
                           <Row>
                              {visibleBlogs.map(blog => (
                                 <BlogCard key={blog.id} blog={blog} />
                              ))}
                           </Row>
                        </>
                     )}
                  </>
               )}
            </Container>
         </div>
      </React.Fragment>
   )
}

const BlogCard = props => {
   return (
      <Col xl={3} lg={4} md={4} sm={4}>
         <Card>
            <CardImg
               top
               className="img-fluid mx-auto"
               src={process.env.REACT_APP_STRAPI_BASE_URL + props.blog.picture?.url}
               style={{
                  height: "30vh",
                  resize: "both",
                  overflow: "visible",
                  width: "98%",
               }}
               alt={props.blog.title}
            />
            <CardBody>
               <CardTitle className="mt-0">{props.blog.title.length > 25 ? props.blog.title.slice(0, 25) + " ..." : props.blog.title}</CardTitle>
               <CardText>
                  <Row>
                     <Col xl={6} className="text-left">
                        Шинэчлэгдсэн огноо:
                     </Col>
                     <Col xl={6} className="text-right mb-2">
                        <strong className="d-block">{new Date(props.blog.updated_at).toLocaleDateString()}</strong>
                     </Col>
                  </Row>
               </CardText>
               <Row>
                  <Col xl={6} className="text-left">
                     <Link to={{ pathname: "/blog/" + props.blog.id, query: { blog: props.blog } }} className="btn btn-info waves-effect waves-light">
                        Дэлгэрэнгүй
                     </Link>
                  </Col>
                  {/* <Col
              xl={6}
              className="d-flex align-items-center justify-content-around"
            >
              <i
                style={{
                  color: props.blog.has_sale ? "#24ea75" : "#767676",
                  fontSize: "28px",
                }}
                className="bx bxs-book-open font-size-30"
              />
              <i
                style={{
                  color: props.blog.has_pdf ? "#fe2379" : "#767676",
                  fontSize: "28px",
                }}
                className="bx bxs-music"
              />
              <i
                style={{
                  color: props.blog.has_audio ? "#ffd722" : "#767676",
                  fontSize: "28px",
                }}
                className="bx bxs-file-pdf"
              />
            </Col> */}
               </Row>
            </CardBody>
         </Card>
      </Col>
   )
}

export default BlogsList
