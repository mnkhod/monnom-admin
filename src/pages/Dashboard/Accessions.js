import React, { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"

const Accessions = props => {
  const series = [
    props.userByAge.category18,
    props.userByAge.category18_28,
    props.userByAge.category28_38,
    props.userByAge.category38_48,
    props.userByAge.category48_58,
    props.userByAge.category58,
  ]

  const options = {
    labels: [
      "18 доош нас",
      "18 - 28 нас",
      "28 - 38 нас",
      "38 - 48 нас",
      "48 - 58 нас",
      "58 дээш нас ",
    ],
    colors: ["#34c38f", "#556ee6", "#e243a2", "#1c93a3", "#f1cd23", "#b83023"],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      verticalAlign: "middle",
      floating: false,
      fontSize: "14px",
      offsetX: 0,
      offsetY: -10,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }

  return (
    <ReactApexChart options={options} series={series} type="pie" height="380" />
  )
}

export default Accessions
