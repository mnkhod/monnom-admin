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
    const [users, setUsers] = useState([]);

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

    const fetchUsers = async () => {
        try {
            const response = await axios({
                url: `${process.env.REACT_APP_STRAPI_BASE_URL}/users`,
                method: "GET",

                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user_information")).jwt}`,
                },
            });
            setUsers(response.data || []);
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

    const sendNotification = async ({ notification, tokens }) => {
        const { title, body, imageUrl } = notification;
        console.log('tokens:');
        console.log(tokens.length);
        console.log(tokens.length ? tokens[0] : null);
        if (!tokens.length) {
            return;
        }
        console.log(tokens);
        const data = {
            "registration_ids": tokens,
            // registration_ids: ['e74-jFoxSKWkdltb_CdJjv:APA91bFvP4LcEImo2wHUsw9pdj6KdEdOaCaQGcmSAl7hoFSuarGKf8J4j-6Ub6WPRQDJuJOfB1LiRmol86ud-WkSUeoQ1TjBDfRFKuwePFktol6Yoqm8ql00s8mUZq33mv1a-ZV-YkJ3'],
            notification: {
                "title": title,
                "body": body || null,
            },
            android: {
            },
        };
        if (imageUrl) {
            data.android = {
                ...data.android,
                icon: imageUrl
            }
        }
        const response = await axios({
            url: 'https://fcm.googleapis.com/fcm/send',
            method: 'POST',
            headers: {
                Authorization: `key=${process.env.REACT_APP_FCM_KEY}`,
            },
            data
        });
        return response;
    }

    useEffect(() => {
        (async () => {
            await Promise.all([fetchNotfications(),
            fetchUsers()])
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
            const tokens = (users || []).map(u => u.fcm_token).filter(t => t);
            const result = await sendNotification({ notification: createdNotification, tokens });
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