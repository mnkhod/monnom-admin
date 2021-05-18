import React, { useState, useEffect } from "react"
import ReactApexChart from "react-apexcharts"

const BookAnalysis = props => {
  const [categories, set_categories] = useState([])
  const [book_series, set_book_series] = useState([])
  const [online_book_series, set_online_book_series] = useState([])

  useEffect(() => {
    let tempCategories = []
    let tempBookSeries = []
    let tempOnlineBookSeries = []

    props.books.forEach(book => {
      tempCategories.push(book.id)
      tempBookSeries.push(book.book_sales_count)
      tempOnlineBookSeries.push(book.online_book_sales_count)

      set_categories(tempCategories)
      set_book_series(tempBookSeries)
      set_online_book_series(tempOnlineBookSeries)
    })
  }, [])

  const series = [
    {
      name: "Хэвлэмэл ном",
      data: book_series,
    },
    {
      name: "Цахим ном",
      data: online_book_series,
    },
  ]
  const options = {
    chart: { zoom: { enabled: !1 }, toolbar: { show: !1 } },
    colors: ["#556ee6", "#f46a6a", "#34c38f"],
    dataLabels: { enabled: !1 },
    stroke: { width: [3, 4, 3], curve: "straight", dashArray: [0, 8, 5] },
    title: { text: "Борлуулалтын график", align: "left" },
    markers: { size: 0, hover: { sizeOffset: 6 } },
    xaxis: {
      categories: categories,
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: function (e) {
              return e + " борлуулалт"
            },
          },
        },
        {
          title: {
            formatter: function (e) {
              return e + " борлуулалт"
            },
          },
        },
      ],
    },
    grid: { borderColor: "#f1f1f1" },
  }

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height="380"
    />
  )
}

export default BookAnalysis
