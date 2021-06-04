import React, { useState, useEffect } from "react"
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, NavLink, NavItem, Nav, TabContent, TabPane } from "reactstrap"

import classnames from "classnames"

import "./datatables.scss"

const bookColumns = [
   {
      label: "№",
      field: "book_id",
      sort: "desc",
      width: 10,
   },
   {
      label: "Хэрэглэгчийн нэр",
      field: "user_name",
      sort: "desc",
      width: 10,
   },
   {
      label: "Нэр",
      field: "book_name",
      width: 150,
      sort: "desc",
   },
   {
      label: "Зарагдсан тоо",
      field: "book_buy_count",
      sort: "desc",
      width: 70,
   },
   {
      label: "Үнэ",
      field: "book_buy_price",
      sort: "desc",
      width: 70,
   },
   {
      label: "Бүртгэгдсэн огноо",
      field: "book_date",
      sort: "desc",
      width: 100,
   },
]

const ebookColumns = [
   {
      label: "№",
      field: "ebook_id",
      sort: "desc",
      width: 10,
   },
   {
      label: "Хэрэглэгчийн нэр",
      field: "e_user_name",
      sort: "desc",
      width: 10,
   },
   {
      label: "Нэр",
      field: "ebook_name",
      width: 150,
      sort: "desc",
   },
   {
      label: "Зарагдсан тоо",
      field: "ebook_buy_count",
      sort: "desc",
      width: 70,
   },
   {
      label: "Үнэ",
      field: "ebook_buy_price",
      sort: "desc",
      width: 70,
   },
   {
      label: "Бүртгэгдсэн огноо",
      field: "ebook_date",
      sort: "desc",
      width: 100,
   },
]

const SalesList = props => {
   const [books, set_books] = useState([])
   const [ebooks, set_ebooks] = useState([])

   const [activeTab, setactiveTab] = useState("1")

   function toggle(tab) {
      if (activeTab !== tab) {
         setactiveTab(tab)
      }
   }

   const initBookData = books => {
      let tempInitialBookData = []
      books.forEach(d => {
         let tempBook = tempInitialBookData.find(book => book.book_id == d.book.id)
         if (tempBook != undefined && tempInitialBookData.length != 0) tempBook.ebook_buy_count += 1
         else
            tempInitialBookData.push({
               book_id: d.book.id,
               user_name: d.users_permissions_user.username,
               book_name: d.book.name,
               book_buy_count: 1,
               book_buy_price: d.book.online_book_price,
               book_date: new Date(d.updated_at).toLocaleString("mn-MN", {
                  timeZone: "Asia/Ulaanbaatar",
               }),
            })
      })

      tempInitialBookData.sort(function (a, b) {
         return b.book_buy_count - a.book_buy_count
      })

      set_books(tempInitialBookData)
   }

   const initEbookData = ebooks => {
      let tempInitialEbookData = []
      ebooks.forEach(d => {
         let tempBook = tempInitialEbookData.find(ebook => ebook.ebook_id == d.book?.id)
         if (tempBook != undefined && tempInitialEbookData.length != 0) tempBook.ebook_buy_count += 1
         else
            try {
               tempInitialEbookData.push({
                  ebook_id: d.book?.id,
                  e_user_name: d.users_permissions_user.username,
                  ebook_name: d.book?.name,
                  ebook_buy_count: 1,
                  ebook_buy_price: d.book?.online_book_price,
                  ebook_date: new Date(d.updated_at).toLocaleString("mn-MN", {
                     timeZone: "Asia/Ulaanbaatar",
                  }),
               })
            } catch (error) {}
      })

      tempInitialEbookData.sort(function (a, b) {
         return b.ebook_buy_count - a.ebook_buy_count
      })

      set_ebooks(tempInitialEbookData)
   }

   const bookDatatable = { columns: bookColumns, rows: books }
   const ebookDatatable = { columns: ebookColumns, rows: ebooks }

   useEffect(() => {
      initBookData(props.books)
      initEbookData(props.ebooks)
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
                                 className={classnames({
                                    active: activeTab === "1",
                                 })}
                                 onClick={() => {
                                    toggle("1")
                                 }}
                              >
                                 <strong className="font-size-17">Хэвлэмэл ном</strong>
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
                        </Nav>
                        <TabContent activeTab={activeTab}>
                           <TabPane tabId="1" className="p-3">
                              <MDBDataTable
                                 proSelect
                                 responsive
                                 striped
                                 bordered
                                 data={bookDatatable}
                                 noBottomColumns
                                 noRecordsFoundLabel={"Ном байхгүй"}
                                 infoLabel={["", "-ээс", "дахь ном. Нийт", ""]}
                                 entries={5}
                                 entriesOptions={[5, 10, 20]}
                                 paginationLabel={["Өмнөх", "Дараах"]}
                                 searchingLabel={"Хайх"}
                                 searching
                              />
                           </TabPane>

                           <TabPane tabId="2" className="p-3">
                              <MDBDataTable
                                 proSelect
                                 responsive
                                 striped
                                 bordered
                                 data={ebookDatatable}
                                 noBottomColumns
                                 noRecordsFoundLabel={"Ном байхгүй"}
                                 infoLabel={["", "-ээс", "дахь ном. Нийт", ""]}
                                 entries={5}
                                 entriesOptions={[5, 10, 20]}
                                 paginationLabel={["Өмнөх", "Дараах"]}
                                 searchingLabel={"Хайх"}
                                 searching
                              />
                           </TabPane>
                        </TabContent>
                     </CardBody>
                  </Card>
               </Col>
            </Row>
         </div>
      </React.Fragment>
   )
}

export default SalesList
