import React, { useEffect, useMemo, useState } from "react"

import { Row, Col, Card, CardBody, CardTitle, Button, Spinner } from "reactstrap"
import axios from "axios"
import SweetAlert from "react-bootstrap-sweetalert"

import { getConfig } from "@testing-library/dom"

const getAxiosConfig = () => {
   return {
      headers: {
         Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
      },
   }
}
export default function BlogCategoryCrud(props) {
   const [isAdding, setIsAdding] = useState(false)
   const [isDeleting, setIsDeleting] = useState(false)

   const [categories, setCategories] = useState([])
   const [categoryName, setCategoryName] = useState("")
   const [deleteCategoryId, setDeleteCategoryId] = useState(null)

   const handleAdd = async () => {
      if (isAdding) {
         return
      }
      setIsAdding(true)
      try {
         const config = getConfig()
         const response = await axios.post(`${process.env.REACT_APP_STRAPI_BASE_URL}/blog-categories`, { name: categoryName }, config)
         if (response.data) {
            console.log(response.data)
            setCategories([response.data, ...categories])
            setCategoryName("")
         }
      } catch (e) {}
      setIsAdding(false)
   }

   const handleDelete = async id => {
      if (isDeleting) {
         return
      }
      setIsDeleting(true)
      try {
         const config = getConfig()
         const response = await axios.delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/blog-categories/${id}`, config)
         if (response.data) {
            const filtered = categories.filter(c => c.id != id)
            setCategories(filtered)
            if (filtered.length > 0) {
               setDeleteCategoryId(filtered[0].id)
            }
         }
      } catch (e) {}
      setIsDeleting(false)
   }

   const refreshCategories = async () => {
      const config = getAxiosConfig()
      try {
         const response = await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}/blog-categories`, config)
         setCategories(response.data)
      } catch (e) {}
   }

   useEffect(() => {
      refreshCategories()
   }, [])

   return (
      <Col lg={12}>
         <Card>
            <CardTitle className="p-3">Мэдээний төрөл нэмэх</CardTitle>
            <CardBody>
               <Row className="mb-3">
                  <Col>
                     <p>Мэдээний төрлийн нэр</p>
                     <input
                        className="form-control"
                        type="text"
                        placeholder="Нэр оруулах"
                        value={categoryName}
                        onChange={e => {
                           setCategoryName(e.target.value)
                        }}
                     />
                  </Col>
               </Row>
               <Row>
                  <Col lg={10}></Col>
                  <Col lg={2}>
                     <Button onClick={handleAdd} className="btn btn-success text-dark">
                        {isAdding ? <Spinner /> : "Нэмэх"}
                     </Button>
                  </Col>
               </Row>
            </CardBody>
         </Card>
         <Row>
            <Col lg={12}>
               <Card>
                  <CardTitle className="p-3">Мэдээний төрөл устгах</CardTitle>
                  <CardBody>
                     <Row>
                        <Col lg={9} className="">
                           <select
                              className="form-control"
                              id="allChannels"
                              onChange={e => {
                                 setDeleteCategoryId(e.target.value)
                              }}
                           >
                              <option selected defaultValue hidden value={deleteCategoryId}>
                                 --Сонгох--
                              </option>
                              {categories.length != 0 ? categories.map(category => <option value={category.id}>{category.name}</option>) : null}
                           </select>
                        </Col>
                        <Col lg={2}>
                           <Button
                              className="btn btn-info"
                              onClick={() => {
                                 handleDelete(deleteCategoryId)
                              }}
                           >
                              {isDeleting ? <Spinner /> : "Устгах"}
                           </Button>
                        </Col>
                     </Row>
                  </CardBody>
               </Card>
            </Col>
         </Row>
      </Col>
   )
}
