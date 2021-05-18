import React from "react"
import ReactApexChart from "react-apexcharts"

const AccessByGender = props => {
  const series = [
    props.acces_by_gender.maleCount,
    props.acces_by_gender.femaleCount,
    props.acces_by_gender.othersCount,
  ]

  const options = {
    labels: ["Эрэгтэй", "Эмэгтэй", "Бусад"],
    colors: ["#34c38f", "#556ee6", "#e243a2"],
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

export default AccessByGender
