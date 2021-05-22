import React from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Container } from "reactstrap"

const BlogsList = props => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Мэдээ мэдээлэл"
            breadcrumbItem="Мэдээ мэдээллийн жагсаалт"
          />
          <h1>blogs list</h1>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default BlogsList
