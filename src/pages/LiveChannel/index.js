import React from "react"
import Breadcrumb from "../../components/Common/Breadcrumb"
import { Row, Col, Card, CardBody } from "reactstrap"

import { LiveChannelContextProvider } from "../../contexts/LiveChannelContext"

import LeftBar from "./LeftBar"
import Live from "./Live"
import RightBar from "./RightBar"

const LiveChannel = () => {
  return (
    <React.Fragment>
      <LiveChannelContextProvider>
        <div className="page-content">
          <Breadcrumb breadcrumbItem="Лайв суваг" title="Лайв" />

          <Row>
            <Col xl={3} gl={3}>
              <LeftBar />
            </Col>
            <Col xl={6} gl={6}>
              <Card>
                <CardBody>
                  <Live />
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} gl={3}>
              <RightBar />
            </Col>
          </Row>
        </div>
      </LiveChannelContextProvider>
    </React.Fragment>
  )
}

export default LiveChannel
