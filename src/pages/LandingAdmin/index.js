import React, { useState, useEffect } from "react"
import { Spinner } from "reactstrap"
import LandingAdminForm from "./LandingAdminForm"
import axios from "axios"

export default function LandingAdmin(props) {
   const [landingData, setLandingData] = useState(null)

   const fetchLandingData = async () => {
      const config = {
         headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
         },
      }

      const response = await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}/landing-page`, config)
      setLandingData(response.data)
   }
   useEffect(() => {
      fetchLandingData()
   }, [])
   return <div className="page-content">{landingData ? <LandingAdminForm landingData={landingData} /> : <Spinner />}</div>
}
