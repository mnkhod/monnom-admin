import React, {useState, useEffect} from 'react';

import {Container, Row, Col, Form, FormGroup, Button, Input, Label} from 'reactstrap';
import {Formik, Field, ErrorMessage} from 'formik';
import ImagePicker from '../../components/Common/ImagePicker';

import Comments from './comments';
import axios from 'axios';

export default function LandingAdmin({landingData}){
    
    const comments = landingData?.comments || [];
    const section2 = [1, 2, 3];
    const features = [1, 2, 3];
    const footerImages = [1, 2, 3, 4];

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <Formik initialValues={landingData}>
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => {
                                console.log(values);
                                const homeImages = [values.HomeApp1, values.HomeApp2, values.HomeApp3];
                                const section1 = [
                                    {
                                        titleName: 'Section1_title1',
                                        title: values.Section1_title1,
                                        description: values.Section1_description1,
                                        descriptionName: 'Section1_description1',
                                        image: `${process.env.REACT_APP_STRAPI_BASE_URL}${values.Section1_img1?.url}`
                                    },
                                    {
                                        titleName: 'Section1_title2',
                                        title: values.Section1_title2,
                                        description: values.Section1_description2,
                                        descriptionName: 'Section1_description2',
                                        image: `${process.env.REACT_APP_STRAPI_BASE_URL}${values.Section1_img2?.url}`
                                    },
                                    {
                                        titleName: 'Section1_title3',
                                        title: values.Section1_title3,
                                        description: values.Section1_description3,
                                        descriptionName: 'Section1_description3',
                                        image: `${process.env.REACT_APP_STRAPI_BASE_URL}${values.Section1_img3?.url}`
                                    },
                                ];
                                const section3 = [
                                    {
                                        name: 'Section3_title1',
                                        title: values.Section3_title1,
                                        titleName: 'Section3_title1',
                                        description: values.Section3_description1,
                                        descriptionName: 'Section3_description1',
                                        image: `${process.env.REACT_APP_STRAPI_BASE_URL}${values.Section3_img1?.url}`
                                    },
                                    {
                                        name: 'Section3_title2',
                                        title: values.Section3_title2,
                                        titleName: 'Section3_title2',
                                        description: values.Section3_description2,
                                        descriptionName: 'Section3_description2',
                                        image: `${process.env.REACT_APP_STRAPI_BASE_URL}${values.Section3_img2?.url}`
                                    },
                                    {
                                        name: 'Section3_title3',
                                        title: values.Section3_title3,
                                        titleName: 'Section3_title3',
                                        description: values.Section3_description3,
                                        descriptionName: 'Section3_description3',
                                        image: `${process.env.REACT_APP_STRAPI_BASE_URL}${values.Section3_img3?.url}`
                                    },
                                ];

                                return (
                                    <Form className="w-100">
                                        <FormGroup>
                                            <Label><h1>Home</h1></Label>
                                            <Field name="HeroTitle" as={Input}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Арын зураг</Label>
                                            <Row>
                                                <Col>
                                                    <ImagePicker src={`${process.env.REACT_APP_STRAPI_BASE_URL}${landingData.BackgroundImage?.url}`} />
                                                </Col>
                                                <Col>
                                                    <div className="d-flex w-100 justify-content-around flex-wrap">
                                                        {homeImages.map((homeImg) => <div className="w-25"><ImagePicker src={`${process.env.REACT_APP_STRAPI_BASE_URL}${homeImg?.url}`} /></div>)}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label><h1>Section 1</h1></Label>
                                            <Field as={Input} name="Section1_title" />
                                        </FormGroup>
                                        <FormGroup>
                                            <div className="d-flex w-100 justify-content-around">
                                                {section1.map((s) => (
                                                <div className="w-25 d-flex flex-column">
                                                    <ImagePicker src={s.image} />
                                                    <Field as={Input} name={s.titleName}  />
                                                    <Field as={Input} name={s.descriptionName} />
                                                </div>))}
                                            </div>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label><h1>Section 2</h1></Label>
                                            <Field as={Input} name={'Section2_title'} />
                                            <Field as={Input} name={'Section2_description'} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Row>
                                                <Col>
                                                    <ImagePicker src={`${process.env.REACT_APP_STRAPI_BASE_URL}${values.Section2_img?.url}`} />
                                                </Col>
                                                <Col>
                                                    <Field as={Input} name="AppIntro" />
                                                    <Field as={Input} name="AppDescription" />
                                                    <Field as={Input} name="AppAction" />
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        <FormGroup>
                                            <Row>
                                            <Label><h1>Section 3</h1></Label>
                                                <Field as={Input} name="Section3_title" />
                                                <Field as={Input} name="Section3_description" />
                                            </Row>
                                        </FormGroup>
                                        <FormGroup>
                                            <div className="d-flex justify-content-around">
                                                {section3.map((s) => (
                                                    <div>
                                                        <ImagePicker src={`${s.image}`} />
                                                        <Field as={Input} name={s.titleName} />
                                                        <Field as={Input} name={s.descriptionName} />
                                                    </div>
                                                ))}
                                            </div>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label><h1>Section 4</h1></Label>
                                            <Field as={Input} name="Section4_title" />
                                            <Field as={Input} name="Section4_description" />
                                        </FormGroup>
                                        <FormGroup>
                                            <div className="d-flex justify-content-around">
                                                {values?.FooterImages.map((f) => (
                                                    <div className="w-25"><ImagePicker src={`${process.env.REACT_APP_STRAPI_BASE_URL}${f.url}`}/></div>
                                                ))}
                                            </div>
                                        </FormGroup>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </Col>
                </Row>
                <Row>
                    <Comments comments={comments} />
                </Row>
                <Button className="mb-5" color={'primary'}>Хадгалах</Button>
            </Container>
        </>
    )
}