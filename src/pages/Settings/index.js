import axios from "axios"
import React, { useState, useEffect } from "react"
import { Container, Row, Col, Alert } from "reactstrap"
import { Link } from "react-router-dom"
import Breadcrumbs from "../../components/Common/Breadcrumb"

import SettingsForm from "./SettingsForm"

export default function Settings() {
  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs breadcrumbItem="Тохиргоо" title="Үйлчилгээ" />
        <Container fluid>
          <SettingsForm />
        </Container>
      </div>
    </React.Fragment>
  )
}
