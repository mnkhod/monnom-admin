import React, { useState, useEffect } from "react"
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, NavLink, NavItem, Nav, TabContent, TabPane } from "reactstrap"

import classnames from "classnames"

import "./datatables.scss"

const bookColumns = [
   { label: "№", field: "book_id", sort: "desc", width: 10 },
   { label: "Хэрэглэгчийн нэр", field: "user_name", sort: "desc", width: 10 },
   { label: "Нэр", field: "book_name", width: 150, sort: "desc" },
   { label: "Үнэ", field: "book_buy_price", sort: "desc", width: 70 },
   { label: "Бүртгэгдсэн огноо", field: "book_date", sort: "desc", width: 100 },
]

const ebookColumns = [
   { label: "№", field: "ebook_id", sort: "desc", width: 10 },
   { label: "Хэрэглэгчийн нэр", field: "e_user_name", sort: "desc", width: 10 },
   { label: "Нэр", field: "ebook_name", width: 150, sort: "desc" },
   { label: "Үнэ", field: "ebook_buy_price", sort: "desc", width: 70 },
   { label: "Бүртгэгдсэн огноо", field: "ebook_date", sort: "desc", width: 100 },
]

const audioBookColumns = [
   { label: "№", field: "audio_book_id", sort: "desc", width: 10 },
   { label: "Хэрэглэгчийн нэр", field: "audio_user_name", sort: "desc", width: 10 },
   { label: "Нэр", field: "audio_book_name", width: 150, sort: "desc" },
   { label: "Үнэ", field: "audio_book_buy_price", sort: "desc", width: 70 },
   { label: "Бүртгэгдсэн огноо", field: "audio_book_date", sort: "desc", width: 100 },
]

const SalesList = props => {
   const [books, set_books] = useState([])
   const [ebooks, set_ebooks] = useState([])
   const [audio_books, set_audio_ebooks] = useState([])

   const [activeTab, setactiveTab] = useState("1")

   const initBookData = books => {
      set_books(
         books.map(d => {
            if (d.book && d.users_permissions_user)
               return {
                  book_id: d.book?.id,
                  user_name: d.users_permissions_user?.username,
                  book_name: d.book?.name,
                  book_buy_price: d.book?.book_price,
                  book_date: new Date(d.updated_at).toLocaleString("mn-MN", {
                     timeZone: "Asia/Ulaanbaatar",
                  }),
               }
         })
      )
   }

   const initAudioBookData = audio_books => {
      set_audio_ebooks(
         audio_books.map(d => {
            if (d.book && d.users_permissions_user)
               return {
                  audio_book_id: d.book?.id,
                  audio_user_name: d.users_permissions_user?.username,
                  audio_book_name: d.book?.name,
                  audio_book_buy_price: d.book?.audio_book_price,
                  audio_book_date: new Date(d.updated_at).toLocaleString("mn-MN", {
                     timeZone: "Asia/Ulaanbaatar",
                  }),
               }
         })
      )
   }

   const initEbookData = e_books => {
      set_ebooks(
         e_books.map(d => {
            if (d.book && d.users_permissions_user)
               return {
                  ebook_id: d.book?.id,
                  e_user_name: d.users_permissions_user?.username,
                  ebook_name: d.book?.name,
                  ebook_buy_price: d.book?.online_book_price,
                  ebook_date: new Date(d.updated_at).toLocaleDateString("mn-MN", {
                     timeZone: "Asia/Ulaanbaatar",
                  }),
               }
         })
      )
   }

   const bookDatatable = { columns: bookColumns, rows: books }
   const ebookDatatable = { columns: ebookColumns, rows: ebooks }
   const audioBookDatatable = { columns: audioBookColumns, rows: audio_books }

   useEffect(() => {
      initBookData(props.books)
      initEbookData(props.ebooks)
      initAudioBookData(props.audio_books)
   }, [props])

   return (
      <React.Fragment>
         <div className="container-fluid">
            <Row>
               <Col className="col-12">
                  <Card>
                     <CardBody>
                        <CardSubtitle className="mb-5"></CardSubtitle>

                        <Nav tabs className="nav-tabs-custom nav-justified">
                           <NavItem>
                              <NavLink
                                 style={{ cursor: "pointer" }}
                                 className={classnames({ active: activeTab === "1" })}
                                 onClick={() => {
                                    toggle("1")
                                 }}
                              >
                                 <strong className="font-size-17"> Аудио ном</strong>
                              </NavLink>
                           </NavItem>

                           <NavItem>
                              <NavLink
                                 style={{ cursor: "pointer" }}
                                 className={classnames({
                                    active: activeTab === "2",
                                 })}
                                 onClick={() => {
                                    toggle("2")
                                 }}
                              >
                                 <strong className="font-size-17"> Цахим ном</strong>
                              </NavLink>
                           </NavItem>

                           <NavItem>
                              <NavLink
                                 style={{ cursor: "pointer" }}
                                 className={classnames({
                                    active: activeTab === "3",
                                 })}
                                 onClick={() => {
                                    toggle("3")
                                 }}
                              >
                                 <strong className="font-size-17">Хэвлэмэл ном</strong>
                              </NavLink>
                           </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                           <TabPane tabId="1" className="p-3">
                              {DataTable(audioBookDatatable)}
                           </TabPane>
                           <TabPane tabId="2" className="p-3">
                              {DataTable(ebookDatatable)}
                           </TabPane>
                           <TabPane tabId="3" className="p-3">
                              {DataTable(bookDatatable)}
                           </TabPane>
                        </TabContent>
                     </CardBody>
                  </Card>
               </Col>
            </Row>
         </div>
      </React.Fragment>
   )

   function toggle(tab) {
      if (activeTab !== tab) {
         setactiveTab(tab)
      }
   }
}

const DataTable = content => {
   return <MDBDataTable proSelect responsive striped bordered data={content} noBottomColumns noRecordsFoundLabel={"Ном байхгүй"} infoLabel={["", "-ээс", "дахь ном. Нийт", ""]} entries={5} entriesOptions={[5, 10, 20]} paginationLabel={["Өмнөх", "Дараах"]} searchingLabel={"Хайх"} searching />
}

export default SalesList
