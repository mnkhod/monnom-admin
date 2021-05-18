import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  TabPane,
  TabContent,
  Table,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap"

import classnames from "classnames"

const MostPopularBook = props => {
  const [activeTab, setactiveTab] = useState("1")

  const [books, set_books] = useState([])
  const [pdfbooks, set_pdfbooks] = useState([])
  const [audio_books, set_audio_books] = useState([])

  useEffect(() => {
    if (props.data != null) {
      set_books(props.data.mostBoughtBooks.slice(0, 10))
      set_audio_books(props.data.mostBoughtPDFBooks.slice(0, 10))
      set_pdfbooks(props.data.mostBoughtAudioBooks.slice(0, 10))
    }
  }, [props])

  function toggle(tab) {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }

  return (
    <>
      {books.length != 0 ? (
        <Card>
          <CardBody>
            <CardTitle>Хамгийн их борлуулалттай ном</CardTitle>
            <CardSubtitle className="mb-3"></CardSubtitle>

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
                  Ном
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
                  Аудио ном
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
                  Цахим ном
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1" className="p-3">
                <Row>
                  <Col sm="12">
                    <CardText>
                      <Table className="table mb-0">
                        <thead>
                          <tr>
                            <th>Дугаар</th>
                            <th>Нэр</th>
                            <th>Онцлох</th>
                            <th>Нийт дагагчид</th>
                          </tr>
                        </thead>
                        <tbody>
                          {books.map((book, index) => (
                            <tr key={index}>
                              <th>{book.id + index}</th>
                              <td>{book.name}</td>
                              <td>{book.is_featured}</td>
                              <td>{book.bought_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </CardText>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2" className="p-3">
                <Row>
                  <Col sm="12">
                    <CardText>
                      <Table className="table mb-0">
                        <thead>
                          <tr>
                            <th>Дугаар</th>
                            <th>Нэр</th>
                            <th>Онцлох</th>
                            <th>Нийт дагагчид</th>
                          </tr>
                        </thead>
                        <tbody>
                          {audio_books.map((book, index) => (
                            <tr key={index}>
                              <th>{book.id + index}</th>
                              <td>{book.name}</td>
                              <td>{book.is_featured}</td>
                              <td>{book.bought_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </CardText>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3" className="p-3">
                <Row>
                  <Col sm="12">
                    <CardText>
                      <Table className="table mb-0">
                        <thead>
                          <tr>
                            <th>Дугаар</th>
                            <th>Нэр</th>
                            <th>Онцлох</th>
                            <th>Нийт дагагчид</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pdfbooks.map((book, index) => (
                            <tr key={index}>
                              <th>{book.id + index}</th>
                              <td>{book.name}</td>
                              <td>{book.is_featured}</td>
                              <td>{book.bought_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </CardText>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      ) : (
        []
      )}
    </>
  )
}

export default MostPopularBook
