import React from "react"
import { Container } from "reactstrap"
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
