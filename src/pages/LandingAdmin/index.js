import React, {useState, useEffect} from 'react';

import {Container, Row, Col, Form, FormGroup, Button, Input, Label, Spinner} from 'reactstrap';
import {Formik} from 'formik';
import ImagePicker from '../../components/Common/ImagePicker';

import LandingAdminForm from './LandingAdminForm';
import Comments from './comments';
import axios from 'axios';

export default function LandingAdmin(props){

    const [landingData, setLandingData] = useState(null);

    const fetchLandingData = async () => {
        const response = await axios.get(`${process.env.REACT_APP_STRAPI_BASE_URL}/landing-page`);
        setLandingData(response.data);
    }
    useEffect(() => {
        fetchLandingData();
    }, []);
    return (
        <div className="page-content">
            {landingData? (<LandingAdminForm landingData={landingData} />):(<Spinner />)}
        </div>
    )
}