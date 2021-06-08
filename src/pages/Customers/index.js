import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, CardBody, CardTitle, Alert } from "reactstrap"
import { Link } from "react-router-dom"
import MetaTags from "react-meta-tags"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import GivePermission from "./givePermission"

import axios from "axios"
import { MDBDataTable } from "mdbreact"
require("dotenv").config()

const Customers = () => {
   const [tableRows, setTableRows] = useState([])

   // Check network
   const [isNetworkError, setIsNetworkError] = useState(false)
   const [isNetworkLoading, SetIsNetworkLoading] = useState(true)
   const [selected_user_id, set_selected_user_id] = useState(null)
   const [modal_toggle, set_modal_toggle] = useState(false)

   const data = {
      columns: [
         {
            label: "Нэр",
            field: "name",
            sort: "asc",
            width: 150,
         },
         {
            label: "Э-Майл",
            field: "email",
            sort: "asc",
            width: 150,
         },
         {
            label: "Утас",
            field: "phone",
            sort: "asc",
            width: 150,
         },
         {
            label: "Хүйс",
            field: "gender",
            sort: "asc",
            width: 100,
         },
         {
            label: "Бүртгүүлсэн",
            field: "date",
            sort: "asc",
            width: 150,
         },
         {
            label: "Худалдан авалтууд",
            field: "gift",
            sort: "disabled",
         },
      ],
      rows: tableRows,
   }

   async function fetchData() {
      await axios({
         url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/all-app-users`,
         method: "GET",
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      })
         .then(res => {
            setIsNetworkError(false)
            SetIsNetworkLoading(false)
            let tempRows = res.data.map(data => {
               return {
                  id: data.id,
                  name: data.fullname,
                  email: data.email,
                  phone: data.phone,
                  gender: data.gender === "Male" ? "Эр" : "Эм",
                  date: new Date(data.created_at).toLocaleString(),
                  gift: (
                     <a
                        href="#"
                        onClick={() => {
                           set_selected_user_id(data.id)
                           set_modal_toggle(true)
                        }}
                        style={{ cursor: "pointer", fontSize: "12px" }}
                     >
                        Харах
                     </a>
                  ),
               }
            })
            setTableRows(tempRows)
         })
         .catch(err => {
            SetIsNetworkLoading(false)
            setIsNetworkError(false)
         })
   }

   useEffect(() => {
      fetchData()
   }, [])

   return (
      <React.Fragment>
         <div className="page-content">
            <Container fluid>
               <Breadcrumbs title="Хэрэглэгчид" breadcrumbItem="Хэрэглэгчдийн жагсаалт" />
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
                     ) : (
                        <Row>
                           {modal_toggle ? <GivePermission set_modal_toggle={set_modal_toggle} modal_toggle={modal_toggle} selected_user_id={selected_user_id} setIsNetworkError={setIsNetworkError} /> : null}
                           <Col className="col-12">
                              <Card>
                                 <CardBody>
                                    <MDBDataTable
                                       proSelect
                                       responsive
                                       bordered
                                       data={data}
                                       noBottomColumns
                                       noRecordsFoundLabel={"Хэрэглэгч байхгүй"}
                                       infoLabel={["", "-ээс", "дахь хэрэглэгч. Нийт", ""]}
                                       entries={10}
                                       entriesOptions={[10, 15, 20]}
                                       paginationLabel={["Өмнөх", "Дараах"]}
                                       searchingLabel={"Хайх"}
                                       searching
                                    />
                                 </CardBody>
                              </Card>
                           </Col>
                        </Row>
                     )}
                  </>
               )}
            </Container>
         </div>
      </React.Fragment>
   )
}

export default Customers
