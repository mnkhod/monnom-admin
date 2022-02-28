import React, { useEffect, useMemo, useState } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Container, Col, Row, Card, CardImg, CardBody, CardTitle, CardText, Pagination, PaginationItem, PaginationLink, Button } from "reactstrap"
import { Link } from "react-router-dom"
import axios from "axios"

import MetaTags from "react-meta-tags"

import NotificationsTable from "./NotificationsTable"
import AddNotification from "./AddNotification"
import SweetAlert from "react-bootstrap-sweetalert"

export default function Notifications(props) {

    const [notifications, setNotifications] = useState([]);

    // Check network
    const [isNetworkError, setIsNetworkError] = useState(false)
    const [isNetworkLoading, SetIsNetworkLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false);

    const [errorMsg, setErrorMsg] = useState(null);

    const showError = useMemo(() => {
        return errorMsg && errorMsg.length > 0;
    }, [errorMsg])

    const [successMsg, setSuccessMsg] = useState(null);
    const showSuccess = useMemo(() => {
        return successMsg && successMsg.length > 0;
    }, [successMsg])

    const [warningMessage, setWarningMessage] = useState(null);
    const showWarning = useMemo(() => {
        return warningMessage && warningMessage.length > 0;
    }, [warningMessage])

    const fetchNotfications = async () => {
        try {
            const response = await axios({
                url: `${process.env.REACT_APP_STRAPI_BASE_URL}/notifications?_sort=id:DESC`,
                method: "GET",

                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
                },
            });
            setNotifications(response.data || []);
        } catch (e) {

        }
    }

    const saveNotification = async ({ title, body, image }) => {
        const formData = new FormData();
        formData.append('data', JSON.stringify({
            title, body
        }));
        if (image != null) {
            try {
                formData.append('files.image', imageFile, imageFile.name);
            } catch (e) {
                console.log(e);
            }
        }
        const response = await axios({
            url: `${process.env.REACT_APP_STRAPI_BASE_URL}/notifications`,
            method: "POST",
            headers: {
                "content-type": "multipart/form-data",
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
            },
            data: formData
        });
        console.log('create response');
        console.log(response.data);
        return response.data;
    }

    const sendNotification = async ({ notification }) => {
        const { title, body } = notification;
        const response = await axios({
            url: `${process.env.REACT_APP_EXPRESS_BASE_URL}/admin/notification`,
            method: 'POST',
            headers: {
                Authorization: `${JSON.parse(localStorage.getItem("user_information")).jwt}`,
            },
            data: {
                title,
                body
            }
        });
        return response;
    }

    useEffect(() => {
        (async () => {
            await Promise.all([fetchNotfications()])
            SetIsNetworkLoading(false);
        })();
    }, []);

    const handleSubmit = async (notif) => {
        setIsLoading(true);
        let state = 'success';
        let createdNotification;
        try {
            createdNotification = await saveNotification(notif);
        } catch (e) {
            setErrorMsg('Алдаа гарлаа')
            console.log(e);
            return;
        }
        try {
            const result = await sendNotification({ notification: createdNotification });
            console.log('send notif response');
            console.log(result)
        } catch (e) {
            console.log(e);
            state = 'error';
        }
        const updatedNotificationResponse = await axios({
            url: `${process.env.REACT_APP_STRAPI_BASE_URL}/notifications/${createdNotification.id}`,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
            },
            data: {
                state: state
            }
        });

        console.log('update response data');
        console.log(updatedNotificationResponse.data);
        setNotifications([updatedNotificationResponse.data, ...notifications]);
        setIsLoading(false);
        if (state === 'error') {
            setErrorMsg('Алдаа гарлаа');
        } else {
            setSuccessMsg('Амжилттай илгээлээ')

        }
    }

    return (
        <React.Fragment>
            {isLoading ? (
                <SweetAlert
                    title={'Түр хүлээнэ үү'}
                    info
                    showCloseButton={false}
                    onConfirm={() => {
                        setIsLoading(false)
                    }}
                    onCancel={() => {
                        setIsLoading(false)
                    }}
                />
            ) : (
                <></>
            )}
            {showError ? (
                <SweetAlert
                    title={errorMsg}
                    danger
                    showCloseButton={false}
                    onConfirm={() => {
                        setErrorMsg("")
                    }}
                    onCancel={() => {
                        setErrorMsg("")
                    }}
                />
            ) : (
                <></>
            )}
            {showSuccess ? <SweetAlert
                title={successMsg}
                success
                showCloseButton={false}
                onConfirm={() => {
                    setSuccessMsg("")
                }}
                onCancel={() => {
                    setSuccessMsg("")
                }}
            /> : <></>}
            {showWarning ? <SweetAlert
                title={warningMessage}
                success
                showCloseButton={false}
                onConfirm={() => {
                    setWarningMessage("")
                }}
                onCancel={() => {
                    setWarningMessage("")
                }}
            /> : <></>}
            <MetaTags>
                <title>Notification</title>
            </MetaTags>
            <div className="page-content">
                {isNetworkLoading ? (<Row>
                    <Col xs="12">
                        <div className="text-center my-3">
                            <Link to="#" className="text-success">
                                <i className="bx bx-hourglass bx-spin mr-2" />
                                Ачааллаж байна
                            </Link>
                        </div>
                    </Col>
                </Row>) : (<Container fluid>
                    <Breadcrumbs title="Notification" breadcrumbItem="Notification" />
                    <Row>
                        <Col xs={12} md={6}>
                            <Card>
                                <CardTitle className="p-3">Notification илгээх</CardTitle>
                                <CardBody>
                                    <AddNotification onSubmit={handleSubmit} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <CardTitle className="p-3">Илгээсэн notification -ууд</CardTitle>
                                <CardBody>
                                    <NotificationsTable data={notifications} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>)}
            </div>

        </React.Fragment>
    )


}