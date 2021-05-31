import React from 'react';
import {Container, Row, Col} from 'reactstrap';

import axios from 'axios';

export default function Comments(props){

    return (props.comments.map((c) => (
        <div className="d-flex">
            <Col>
                <img className="img-responsive" src="https://picsum.photos/150/150" />
            </Col>
            <Col>
                <h3>Title</h3>
            </Col>
        </div>
    )))
}