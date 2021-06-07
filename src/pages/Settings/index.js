import React from "react"
import { Container } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import MetaTags from "react-meta-tags"

import SettingsForm from "./SettingsForm"

export default function Settings() {
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Тохиргоо</title>
        </MetaTags>
        <Breadcrumbs breadcrumbItem="Тохиргоо" title="Үйлчилгээ" />
        <Container fluid>
          <SettingsForm />
        </Container>
      </div>
    </React.Fragment>
  )
}
