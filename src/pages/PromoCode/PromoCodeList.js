import React, { useState, useEffect, useCallback, useMemo } from "react"
import MetaTags from "react-meta-tags"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Link, useParams } from "react-router-dom"
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText, TabPane, TabContent, Table, Nav, NavItem, NavLink, Container, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Progress, Input, FormGroup, Label } from "reactstrap"
import AddPromoCodeType from "./AddPromoCodeType"
import SweetAlert from "react-bootstrap-sweetalert"
import axios from 'axios';
import moment from "moment"
import DataTable from 'react-data-table-component';

const PromoCodeList = () => {

    const [errorMsg, setErrorMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [selectedRow, setSelectedRow] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams();

    const [searchCode, setSearchCode] = useState(null)

    const productId = useMemo(() => {
        return params.productId
    }, [params])

    const [data, setData] = useState([]);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1)
    const [sortParams, setSortParams] = useState({
        column: 'id',
        direction: 'asc'
    })

    useEffect(() => {
        refreshDatatable();
    }, [sortParams, page, perPage, searchCode])

	const handlePageChange = page => {
		setPage(page)
	};

	const handlePerRowsChange = async (newPerPage, page) => {
		setPerPage(newPerPage)
        setPage(page)
	};

    const handleSort = (column, sortDirection) => {
        setSortParams({
            column: column.sortField,
            direction: sortDirection
        })
	};

    const columns = useMemo(() => {
        return [
            {
                name: 'Id',
                selector: row => row.id,
                sortable: true,
                sortField: 'id',
            },
            {
                name: 'code',
                selector: row => row.code,
                sortable: true,
                sortField: 'code',
            },
            {
                name: 'Дуусах огноо',
                selector: row => moment(row.end_date).format('YYYY-MM-DD HH:mm:ss'),
                sortable: true,
                sortField: 'end_date',
            },
            {
                name: 'Үүсгэсэн огноо',
                sortable: true,
                selector: row => moment(row.created_at).format('YYYY-MM-DD HH:mm:ss'),
                sortField: 'created_at',
            },
            {
                name: 'Төлөв',
                selector: row => isUsable(row) ? (<p className="text-success">Хүчинтэй</p>) : (<p className="text-warning">Хүчингүй</p>),
            },
            {
                name: 'Үйлдэл',
                selector: row => (
                    <button onClick={() => {
                        setSelectedRow(row)
                        setIsDeleting(true);
                    }} className="btn btn-danger">
                        Устгах
                    </button>
                )
            }
        ]
    }, [setSelectedRow, setIsDeleting])

    async function refreshDatatable() {
        setIsLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
                },
            }
            const offset = Math.max((page - 1) * perPage, 0);
            const limit = perPage;
            const totalRows = (await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}/promo-codes/count?product=${productId}`, config)).data;
            let getParams = `/promo-codes?product=${productId}`
            if (searchCode?.length) {
                getParams += `&code_contains=${searchCode}`
            } else {
                getParams += `&_start=${offset}&_limit=${limit}&_sort=${sortParams.column}:${sortParams.direction}`
            }
            const response = await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}${getParams}`);
            setData(response.data);
            setTotalRows(totalRows);
            setIsLoading(false)
    }

    async function deleteRow(row) {
        setIsLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
            },
        }
        try {
            await axios.delete(`${process.env.REACT_APP_STRAPI_BASE_URL}/promo-codes/${row.id}`, config).data;
            refreshDatatable();
            setSuccessMsg('Promo code амжилттай усгагдлаа')
        } catch(e) {
            setErrorMsg(e?.response?.data?.message || `${e}`)
        }
        setIsLoading(false)
    }

   return (
      <React.Fragment>
        {successMsg?.length && (
        <SweetAlert
            title={successMsg}
            success
            confirmBtnText="Ok"
            confirmBtnBsStyle="success"
            onConfirm={() => {
                setSuccessMsg(null)
            }}
        />
        )}
        {isDeleting && (
        <SweetAlert
            title={`${selectedRow?.code} -г устгахдаа итгэлтэй байна уу?`}
            warning
            showCancel
            confirmBtnText="Тийм"
            cancelBtnText="Болих"
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            onConfirm={() => {
                deleteRow(selectedRow)
                setIsDeleting(false)
            }}
            onCancel={() => {
                setIsDeleting(false)
            }}
        />
        )}
         <div className="page-content">
            <MetaTags>
               <title>Promo Code List {params.productId}</title>
            </MetaTags>
            <Container fluid>
                {errorMsg?.length? (
                    <Alert color="danger">
                        {errorMsg}
                    </Alert>):(<></>)}
                {isLoading ? (
                <Row>
                    <Col xs="12">
                        <div className="text-center my-3">
                            <Link to="#" className="text-success">
                            <i className="bx bx-hourglass bx-spin mr-2" />
                            Ачааллаж байна
                            </Link>
                        </div>
                    </Col>
                </Row>):(<></>)}
                <Card>
                    <CardBody>
                        <div className="d-flex justify-content-between justify-items-center mb-8 mt-2">
                            <h1>Promo Code</h1>
                            <FormGroup>
                                <Label>Хайлт</Label>
                                <Input placeholder="abc123" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} />
                            </FormGroup>
                        </div>
                    <DataTable
                        columns={columns}
                        data={data}
                        progressPending={isLoading}
                        sortServer
                        persistTableHead
                        onSort={handleSort}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                    />
                    </CardBody>
                </Card>
            </Container>
         </div>
      </React.Fragment>
   )
}

function isUsable(p) {
    if (p.product.is_gift) {
        return !p.users_promo_code
    }
    if (p.product.is_discount) {
        return moment().isBefore(moment(p.end_date))
    }
return false;
}

function getTypeName(product) {
    if (product?.is_gift) {
        return 'Бэлэг'
    }
    if (product?.is_discount) {
        return 'Хямдрал'
    }
    return ''
}

export default PromoCodeList
