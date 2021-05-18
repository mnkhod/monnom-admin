import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MDBDataTable } from "mdbreact"
import AddBook from "./AddBook"
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Label,
  Input,
  FormGroup,
} from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import axios from "axios"
import Select from "react-select"

// book section
const columns = [
  {
    label: "ID",
    field: "book_id",
    // sort: "asc",
    width: 150,
  },
  {
    label: "Нэр",
    field: "book_name",
    // sort: "asc",
    width: 150,
  },
  {
    label: "Зохиолч",
    field: "book_author",
    // sort: "asc",
    width: 100,
  },
  {
    label: "Категори",
    field: "book_category",
    // sort: "asc",
    width: 100,
  },
  {
    label: "Сэтгэгдэлүүд",
    field: "book_comments",
    sort: "disabled",
    width: "100",
  },
  {
    label: "Нийтлэгдсэн огноо",
    field: "book_date",
    sort: "desc",
    width: 70,
  },
  {
    label: "Төрөл",
    field: "type",
    // sort: "asc",
    width: 100,
  },
  {
    label: "Онлайн үнэ",
    field: "online_book_price",
    // sort: "asc",
    width: 50,
  },
  {
    label: "Хэвлэмэл үнэ",
    field: "book_price",
    // sort: "asc",
    width: 50,
  },
  {
    label: "Хэвлэмэл тоо",
    field: "sale_quantity",
    // sort: "asc",
    width: 50,
  },
  {
    label: "Үйлдэл",
    field: "book_edit",
    sort: "disabled",
    width: 20,
  },
]

const List = props => {
  const [data, set_data] = useState(null)

  const [edit_user_step, set_edit_user_step] = useState(false)
  const [book_comments_section, set_book_comments_section] = useState(false)
  const [edit_has_sale, set_edit_has_sale] = useState(false)
  const [edit_has_mp3, set_edit_has_mp3] = useState(false)
  const [edit_has_pdf, set_edit_has_pdf] = useState(false)
  const [edit_book_id, set_edit_book_id] = useState(null)
  const [edit_podcast_state, set_edit_podcast_state] = useState(false)
  const [checked, set_checked] = useState(false)
  const [coverImage, setCoverImage] = useState("")
  const [confirm_edit, set_confirm_edit] = useState(false)
  const [confirm_delete, set_confirm_delete] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_title, setdynamic_title] = useState("")
  const [dynamic_description, setdynamic_description] = useState("")
  const [author_image, set_author_image] = useState(null)
  const [remove_comm, set_remove_comm] = useState("")
  const [optionGroup_authors, set_optionGroup_authors] = useState([])
  const [optionGroup_categories, set_optionGroup_categories] = useState([])
  const [delete_book_id, set_delete_book_id] = useState(null)

  // update, delete hiih state uud
  const [selectedMulti_author, setselectedMulti_author] = useState([])
  const [selectedMulti_category, setselectedMulti_category] = useState([])
  const [edit_book_name, set_edit_book_name] = useState("")
  const [edit_book_desc, set_edit_book_desc] = useState("")
  const [edit_book_img, set_edit_book_img] = useState("")
  const [edit_book_comments, set_edit_book_comments] = useState([])
  const [success_dialog, setsuccess_dialog] = useState(false)
  const [error_dialog, seterror_dialog] = useState(false)
  const [loading_dialog, setloading_dialog] = useState(false)

  // axios oor huselt ywuulj update hiih
  const updateBook = async () => {
    const formData = new FormData()
    let tempSelectedMulti_author = selectedMulti_author.map(multi =>
      multi.value.toString()
    )

    let tempSelectedMulti_category = selectedMulti_category.map(multi =>
      multi.value.toString()
    )

    const config = {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user_information")).jwt
        }`,
      },
    }
    await axios
      .put(
        `${process.env.REACT_APP_STRAPI_BASE_URL}/books/${delete_book_id}`,
        {
          name: edit_book_name,
          description: edit_book_desc,
          book_authors: tempSelectedMulti_author,
          book_categories: tempSelectedMulti_category,
        },
        config
      )
      .then(async res => {
        setloading_dialog(false)
        setsuccess_dialog(true)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(e => {
        setloading_dialog(false)
        seterror_dialog(true)
      })
  }

  // axios oor huselt ywuulj delete hiih
  const deleteBook = async id => {
    await axios
      .delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/books/${id}`)
      .then(async res => {
        setloading_dialog(false)
        setsuccess_dialog(true)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(e => {
        setloading_dialog(false)
        seterror_dialog(true)
      })
  }

  // multiple book authors selected
  function handleMulti_book_author(selectedMulti) {
    setselectedMulti_author(selectedMulti)
  }
  function handleMulti_book_category(selectedMulti) {
    setselectedMulti_category(selectedMulti)
  }

  // props oos irsen nomnii categoruudiig awah
  const getAuthorsInfo = (authors, book_id) => {
    const bookAuthors = props.books
      .find(b => b.id == book_id)
      .book_author.map(author => {
        return {
          label: author.name,
          value: author.id,
        }
      })

    setselectedMulti_author(bookAuthors)

    const a = authors.map(author => {
      return {
        label: author.author_name,
        value: author.id,
      }
    })
    set_optionGroup_authors(a)
  }

  const getCategoryInfo = (categories, book_id) => {
    const bookCategories = props.books
      .find(b => b.id == book_id)
      .book_category.map(category => {
        return {
          label: category.name,
          value: category.id,
        }
      })

    setselectedMulti_category(bookCategories)

    const a = categories.map(category => {
      return {
        label: category.name,
        value: category.id,
      }
    })
    set_optionGroup_categories(a)
  }

  const initData = booksData => {
    let tempInitialData = booksData.map(d => {
      return {
        book_id: d.id,
        book_name: d.book_name,
        // book_author: d.book_author.name,
        book_date: new Date(d.book_added_date).toLocaleString("mn-MN", {
          timeZone: "Asia/Hovd",
        }),
        book_state: d.book_state,
        type: d.type,
        online_book_price: d.online_book_price,
        book_price: d.book_price,
        sale_quantity: d.sale_quantity,
        book_comments: (
          <Link
            className="d-block text-center"
            onClick={() => {
              set_book_comments_section(true)
              set_edit_book_comments(d.book_comments)
            }}
          >
            Харах
          </Link>
        ),
        book_author: (
          <select
            multiple
            size="2"
            className="bg-transparent m-0 p-0"
            style={{ border: "none" }}
          >
            {d.book_author.map(author => (
              <option className="p-0 m-0 w-100 text-left">{author.name}</option>
            ))}
          </select>
        ),
        book_category: (
          <select
            multiple
            size="2"
            className="bg-transparent m-0 p-0"
            style={{ border: "none" }}
          >
            {d.book_category.map(author => (
              <option className="d-block w-100 text-left">{author.name}</option>
            ))}
          </select>
        ),
        book_edit: (
          <Link to="#" className="d-flex justify-content-around">
            <i
              onClick={() => {
                set_edit_user_step(true)
                set_edit_book_name(d.book_name)
                set_edit_book_desc(d.book_desc)
                set_edit_has_pdf(d.has_pdf)
                set_edit_has_mp3(d.has_mp3)
                set_edit_has_sale(d.has_sale)
                set_delete_book_id(d.id)
                setCoverImage(
                  process.env.REACT_APP_STRAPI_BASE_URL + edit_book_img
                )
                getAuthorsInfo(props.available_authors, d.id)
                getCategoryInfo(props.available_categories, d.id)
              }}
              className="bx bxs-edit text-primary font-size-20"
              id="edittooltip"
            />
            <i
              onClick={() => {
                set_delete_book_id(d.id)
                set_confirm_delete(true)
              }}
              className="bx bxs-trash text-danger font-size-20"
            />
          </Link>
        ),
        type: (
          <Link className="d-flex justify-content-around align-items-center">
            <i
              style={{ color: d.has_sale ? "#24ea75" : "#767676" }}
              className="bx bxs-book-open font-size-20"
            />
            <i
              style={{ color: d.has_mp3 ? "#fe2379" : "#767676" }}
              className="bx bxs-music font-size-20"
            />
            <i
              style={{ color: d.has_pdf ? "#ffd722" : "#767676" }}
              className="bx bxs-file-pdf font-size-20"
            />
          </Link>
        ),
      }
    })
    set_data(tempInitialData)
  }

  const book_datatable = {
    columns: columns,
    rows: data,
  }

  useEffect(() => {

    initData(props.books)
  }, [])

  // nomiin zurag solih
  const imageHandler = e => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setCoverImage(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
    set_author_image(e.target.files[0])
  }

  // delete comment
  const removeComment = async comm => {
    set_edit_book_comments(edit_book_comments.filter(x => x !== comm))
    await axios
      .delete(
        `${process.env.REACT_APP_STRAPI_BASE_URL}/book-comments/${comm.id}`
      )
      .then(async res => {
        setsuccess_dialog(true)
      })
      .catch(e => {
        seterror_dialog(true)
      })
  }

  return (
    <React.Fragment>
      <Row>
        {book_comments_section ? (
          <SweetAlert
            confirmBtnBsStyle="primary"
            confirmBtnText="Гарах"
            style={{
              padding: "3em",
              borderRadius: "20px",
            }}
            onConfirm={() => {
              set_book_comments_section(false)
            }}
          >
            <CardTitle className="mb-4">Сэтгэгдэлүүд</CardTitle>
            <Row>
              {edit_book_comments.map((comment, key) => (
                <Col
                  lg={12}
                  key={key}
                  className="border pt-3 rounded mb-2"
                  style={{
                    maxHeight: "500px",
                  }}
                >
                  <div className="d-flex">
                    <p className="text-left">
                      <strong className="text-primary">
                        {comment.user_name}
                      </strong>{" "}
                      - {new Date(comment.created_at).toLocaleString()}
                    </p>
                    <i
                      className="dripicons-cross font-size-20 my-auto text-dark"
                      style={{
                        cursor: "pointer",
                        margin: "auto",
                        marginRight: "0",
                      }}
                      onClick={() => {
                        set_checked(true), set_remove_comm(comment)
                      }}
                    />
                  </div>
                  <p className="text-left">{comment.comment}</p>
                </Col>
              ))}
            </Row>
          </SweetAlert>
        ) : null}
        {edit_user_step ? (
          <SweetAlert
            showCancel
            title="Ерөнхий мэдээлэл"
            cancelBtnBsStyle="danger"
            confirmBtnText="Хадгалах"
            cancelBtnText="Цуцлах"
            style={{
              padding: "3em",
              borderRadius: "20px",
            }}
            onConfirm={() => {
              set_edit_user_step(false)
              set_confirm_edit(true)
            }}
            onCancel={() => {
              set_edit_user_step(false)
            }}
          >
            <Row>
              <Col xs="12" className="mb-3 mt-2">
                <Row className="mb-2">
                  <Col lg={2} className="m-auto">
                    <Label
                      className="my-auto text-left d-block"
                      for="kyclastname-input"
                    >
                      Нэр
                    </Label>
                  </Col>
                  <Col lg={10}>
                    <Input
                      type="text"
                      value={edit_book_name}
                      onChange={event => {
                        set_edit_book_name(event.target.value)
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col lg={12}>
                    <Label
                      className="d-block text-left mb-2"
                      for="kyclastname-input"
                    >
                      Зохиолч
                    </Label>
                    <Select
                      value={selectedMulti_author}
                      isMulti={true}
                      placeholder="Сонгох ... "
                      onChange={e => {
                        handleMulti_book_author(e)
                      }}
                      options={optionGroup_authors}
                      classNamePrefix="select2-selection"
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col lg={12}>
                    <Label
                      className="d-block text-left mb-2"
                      for="kyclastname-input"
                    >
                      Категори
                    </Label>
                    <Select
                      value={selectedMulti_category}
                      isMulti={true}
                      placeholder="Сонгох ... "
                      onChange={e => {
                        handleMulti_book_category(e)
                      }}
                      options={optionGroup_categories}
                      classNamePrefix="select2-selection"
                    />
                  </Col>
                </Row>
              </Col>
              {/* <Col lg={5}>
                  <Label
                    htmlFor="input"
                    className="image-upload d-flex justify-content-center"
                  >
                    Зураг
                    <i className="bx bx-image-add font-size-20 ml-2"></i>
                  </Label>
                  <Row>
                    <img
                      className="rounded"
                      alt=""
                      width="150"
                      src={coverImage}
                      //   onClick={() => {}}
                    />
                  </Row>
                  <input
                    type="file"
                    id="input"
                    accept="image/*"
                    className="invisible"
                    onChange={imageHandler}
                  />
                </Col> */}
              {/* <Col lg={12}>
                <Label className="text-center">Номын төрөл</Label>
                <Link className="d-flex justify-content-around align-items-center w-50 mx-auto">
                  <i
                    style={{ color: edit_has_sale ? "#24ea75" : "#767676" }}
                    className="bx bxs-book-open font-size-20"
                  />
                  <i
                    style={{ color: edit_has_mp3 ? "#fe2379" : "#767676" }}
                    className="bx bxs-music font-size-20"
                  />
                  <i
                    style={{ color: edit_has_pdf ? "#ffd722" : "#767676" }}
                    className="bx bxs-file-pdf font-size-20"
                  />
                </Link>
              </Col> */}
              {/* <Col lg={6} className="my-auto">
                  <label className="d-flex">
                    <span className="d-block my-auto mr-3">Төлөв</span>
                    <Switch
                      checked={edit_podcast_state}
                      onChange={handleChange}
                    />
                  </label>
                </Col> */}
            </Row>

            <Row>
              <Col lg={12}>
                <FormGroup>
                  <Label htmlFor="productdesc" className="w-100 text-left">
                    Тайлбар
                  </Label>
                  <textarea
                    className="form-control"
                    id="productdesc"
                    rows="5"
                    value={edit_book_desc}
                    onChange={event => {
                      set_edit_book_desc(event.target.value)
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </SweetAlert>
        ) : null}
        {loading_dialog ? (
          <SweetAlert
            title="Түр хүлээнэ үү"
            info
            showCloseButton={false}
            showConfirm={false}
            success
          ></SweetAlert>
        ) : null}
        {confirm_edit ? (
          <SweetAlert
            title="Та итгэлтэй байна уу ?"
            warning
            showCancel
            confirmBtnText="Тийм"
            cancelBtnText="Болих"
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            onConfirm={() => {
              set_confirm_edit(false)
              setloading_dialog(true)
              updateBook()
              set_edit_user_step(false)
              setsuccess_dlg(true)
              setdynamic_title("Амжилттай")
              setdynamic_description("Шинэчлэлт амжилттай хийгдлээ.")
            }}
            onCancel={() => {
              set_confirm_edit(false)
              set_edit_user_step(true)
            }}
          ></SweetAlert>
        ) : null}
        {success_dialog ? (
          <SweetAlert
            title={"Амжилттай"}
            timeout={2000}
            style={{
              position: "absolute",
              top: "center",
              right: "center",
            }}
            showCloseButton={false}
            showConfirm={false}
            success
            onConfirm={() => {
              // createPodcast()
              setsuccess_dialog(false)
            }}
          >
            {"Үйлдэл амжилттай боллоо"}
          </SweetAlert>
        ) : null}
        {error_dialog ? (
          <SweetAlert
            title={"Амжилтгүй"}
            timeout={2000}
            style={{
              position: "absolute",
              top: "center",
              right: "center",
            }}
            showCloseButton={false}
            showConfirm={false}
            error
            onConfirm={() => {
              // createPodcast()
              seterror_dialog(false)
            }}
          >
            {"Үйлдэл амжилтгүй боллоо"}
          </SweetAlert>
        ) : null}
        {confirm_delete ? (
          <SweetAlert
            title="Та энэ номыг устгах гэж байна !"
            warning
            showCancel
            confirmBtnText="Тийм"
            cancelBtnText="Болих"
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            onConfirm={() => {
              set_confirm_delete(false)
              setloading_dialog(true)
              deleteBook(delete_book_id)
            }}
            onCancel={() => {
              set_confirm_delete(false)
            }}
          ></SweetAlert>
        ) : null}
        {checked ? (
          <SweetAlert
            title="Та энэ комментыг устгах гэж байна !"
            warning
            showCancel
            confirmBtnText="Тийм"
            cancelBtnText="Болих"
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            onConfirm={() => {
              set_checked(false)
              removeComment(remove_comm)
            }}
            onCancel={() => {
              set_checked(false)
            }}
          ></SweetAlert>
        ) : null}
        <Col className="col-12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between m-0 p-0">
                <CardTitle>Номны жагсаалт</CardTitle>
                <CardTitle>
                  <AddBook
                    user_id={props.user_id}
                    setsuccess_dialog={setsuccess_dialog}
                    seterror_dialog={seterror_dialog}
                    available_categories={props.available_categories}
                    available_authors={props.available_authors}
                  />
                </CardTitle>
              </div>
              <MDBDataTable
                proSelect
                responsive
                striped
                bordered
                data={book_datatable}
                noBottomColumns
                noRecordsFoundLabel={"Ном байхгүй"}
                infoLabel={["", "-ээс", "дахь ном. Нийт", ""]}
                entries={5}
                entriesOptions={[5, 10, 20]}
                paginationLabel={["Өмнөх", "Дараах"]}
                searchingLabel={"Хайх"}
                searching
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default List
