import React from "react"
import { Col } from "reactstrap"

export default function Comments(props) {
   return props.comments.map((c, index) => (
      <div key={index} className="d-flex">
         <Col>
            <img className="img-responsive" src="https://picsum.photos/150/150" />
         </Col>
         <Col>
            <h3>Title</h3>
         </Col>
      </div>
   ))
}
