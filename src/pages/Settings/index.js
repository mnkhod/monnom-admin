import React, { useState } from "react"
import { Container } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import MetaTags from "react-meta-tags"

import SettingsForm from "./SettingsForm"

export default function Settings() {
   const [data, setData] = useState("")
   return (
      <React.Fragment>
         <div className="page-content">
            <MetaTags>
               <title>Тохиргоо</title>
            </MetaTags>
            <Breadcrumbs breadcrumbItem="Тохиргоо" title="Үйлчилгээ" />
            <Container fluid>
               <SettingsForm data={data} />
            </Container>
         </div>
      </React.Fragment>
   )
}
