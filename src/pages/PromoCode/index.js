import React, { useState, useEffect, useCallback } from "react"
import MetaTags from "react-meta-tags"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Link } from "react-router-dom"
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText, TabPane, TabContent, Table, Nav, NavItem, NavLink, Container, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Progress } from "reactstrap"
import AddPromoCodeType from "./AddPromoCodeType"
import SweetAlert from "react-bootstrap-sweetalert"
import { nanoid } from 'nanoid'
import axios from 'axios';
import moment from "moment"

import GeneratePromoCodes from "./GeneratePromoCodes"


const PromoCode = () => {

    const [deletingProduct, setDeletingProduct] = useState(false)
    const [isDeleteProduct, setIsDeleteProduct] = useState(false)
    const [isAddPromoTypeVisible, setIsAddPromoTypeVisible] = useState(false)
    const [isGeneratePromoVisible, setIsGeneratePromoVisible] = useState(false)
    const [productList, setProductList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [generateProgress, setGenerateProgress] = useState(0)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    const [isGeneratePromoInProgress, setIsGeneratePromoInProgress] = useState(false)

    const toggleAddPromoTypeModal = useCallback(
        () => {
            setIsAddPromoTypeVisible(!isAddPromoTypeVisible)
        },
        [isAddPromoTypeVisible],
    )

    const toggleGeneratePromoModal = useCallback(
        () => {
            setIsGeneratePromoVisible(!isGeneratePromoVisible)
        },
        [isGeneratePromoVisible],
    )

    const handleGeneratePromoCodes = useCallback(
        async ({size, endDate}) => {
            setIsGeneratePromoVisible(false);
            setIsGeneratePromoInProgress(true)
            setGenerateProgress(0)
            for(let i=1; i<=size; i++) {
                await generatePromoCode(selectedProduct, {endDate});
                setGenerateProgress(((i / size)*100))
            }
            setIsGeneratePromoInProgress(false);
            setSuccessMessage("Промо кодууд амжилттай үүслээ")
            fetchProductList();
        },
        [selectedProduct],
    )

    useEffect(() => {
        fetchProductList();
    }, [])

   return (
      <React.Fragment>
        {isDeleteProduct && (
            <SweetAlert
               title={`${deletingProduct?.name} -г устгахдаа итгэлтэй байна уу?`}
               warning
               showCancel
               confirmBtnText="Тийм"
               cancelBtnText="Болих"
               confirmBtnBsStyle="success"
               cancelBtnBsStyle="danger"
               onConfirm={() => {
                   deleteProduct(deletingProduct)
                   setIsDeleteProduct(false)
               }}
               onCancel={() => {
                  setIsDeleteProduct(false)
               }}
            />
         )}
         {successMessage?.length && (
            <SweetAlert
               title={successMessage}
               success
               confirmBtnText="Ok"
               confirmBtnBsStyle="success"
               onConfirm={() => {
                   setSuccessMessage(null)
               }}
            />
         )}
         <div className="page-content">
            <MetaTags>
               <title>Promo Code</title>
            </MetaTags>
            <Container fluid>
                {errorMessage? (
                <Alert color="danger">
                    {errorMessage}
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
                <Breadcrumbs title="Promo" breadcrumbItem="Promo Code төрлүүд" />
                <div>
                    <button onClick={toggleAddPromoTypeModal} className="btn btn-primary mb-4">
                        Promo Code төрөл үүсгэх
                    </button>
                </div>
                <Card>
                    <CardBody>
                        <Table className="table mb-0">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Нэр</th>
                                    <th>Төрөл</th>
                                    <th>Хямдралын хувь</th>
                                    <th>Үүсгэсэн огноо</th>
                                    <th>Ашиглагдах боломжит тоо ширхэг</th>
                                    <th>Үйлдэл</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(productList || []).map((p) => (
                                    <tr key={`${p.id}`}>
                                        <th>{p.id}</th>
                                        <td>{p.name}</td>
                                        <td>{getTypeName(p)}</td>
                                        <td>{p.is_gift? `` : `${p.discount_percent}%`}</td>
                                        <td>{moment(p.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                                        <td>{p.avlCount}</td>
                                        <td>
                                            <div>
                                                <button onClick={() => {
                                                    setSelectedProduct(p)
                                                    toggleGeneratePromoModal()
                                                }} className="btn btn-success">
                                                    Промо кодууд үүсгэх
                                                </button>
                                                <Link to={`/promo-code-list/${p.id}`} className="btn btn-info ml-4">
                                                    Жагсаалт
                                                </Link>
                                                <button className="btn btn-danger ml-4" onClick={() => {
                                                    setDeletingProduct(p);
                                                    setIsDeleteProduct(true);
                                                }}>
                                                    Устгах
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Container>
         </div>
         <Modal isOpen={isAddPromoTypeVisible} toggle={toggleAddPromoTypeModal}>
             <ModalHeader toggle={toggleAddPromoTypeModal}>Promo Code төрөл нэмэх</ModalHeader>
             <ModalBody>
                 <AddPromoCodeType onSubmit={handleAddPromoTypeSubmit} />
             </ModalBody>
         </Modal>
         <Modal isOpen={isGeneratePromoVisible} toggle={toggleGeneratePromoModal}>
             <ModalHeader toggle={toggleGeneratePromoModal}><b>{`${selectedProduct?.name}`}</b> промо кодууд үүсгэх ({getTypeName(selectedProduct)})</ModalHeader>
             <ModalBody>
                 <GeneratePromoCodes onSubmit={handleGeneratePromoCodes} product={selectedProduct} />
             </ModalBody>
         </Modal>
         <Modal isOpen={isGeneratePromoInProgress} centered>
             <ModalHeader>
                Промо кодууд үүсэж байна...
             </ModalHeader>
             <Card>
                 <CardBody>
                     <div><h4>{new Number(generateProgress.toFixed(2)).toString()}%</h4></div>
                    <Progress value={generateProgress}/>
                    <div className="mt-4 text-center">
                        <h5>Түр хүлээнэ үү...</h5>
                    </div>
                 </CardBody>
             </Card>
         </Modal>
      </React.Fragment>
   )

   async function generatePromoCode(product, {endDate}) {
       try {
            const config = {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
                },
            }
            const code = nanoid(8);
            const data = {
                end_date: endDate,
                code,
                product: product.id
            }
            await axios.post(`${process.env.REACT_APP_STRAPI_BASE_URL}/promo-codes`, data, config)
       } catch(e) {
           console.log(e)
       }
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

   async function handleAddPromoTypeSubmit(values) {

        const config = {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
            },
        }

        const data = {
            name: values.name,
            is_gift: values.isGift || false,
            is_discount: !(values.isGift || false),
            discount_percent: values.discountPercent
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_STRAPI_BASE_URL}/promo-code-products`, data, config)
            setSuccessMessage("Promo Code төрөл амжилттай нэмэгдлээ")
            fetchProductList();
        } catch(e) {
            setErrorMessage(`${e}`)
        }
        toggleAddPromoTypeModal()
    }

    async function fetchProductList() {
        setIsLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
            },
        }
        try {
            const products = (await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}/promo-code-products?deletedAt_null=true`, config)).data
            const nowParam = moment().format('YYYY-MM-DD+HH:mm:ss')
            const promises = products.map(async (p) => {
                const nonExpiredCount = (await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}/promo-codes/count?end_date_lt=${nowParam}&product=${p.id}`)).data || 0
                const usedCount = (await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}/users-promo-codes/count?&promo_code.product=${p.id}`)).data || 0
                p.avlCount = Math.max(nonExpiredCount - usedCount, 0);
                return p;
            })
            const withAvl = await Promise.all(promises);
            setProductList(withAvl)
        } catch(e) {
            setErrorMessage(`${e}`)
        }
        setIsLoading(false)
    }

    async function deleteProduct(id) {
        setIsLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
            },
        }

        const data = {
            deletedAt: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_STRAPI_BASE_URL}/promo-code-products/${deletingProduct.id}`, data, config)
            fetchProductList();
        } catch(e) {
            setErrorMessage(`${e}`)
        }
        setIsLoading(false)
    }

}

export default PromoCode
