import React, {useMemo, useState} from 'react';

import {Card, CardBody, CardImg, Input, CardHeader} from 'reactstrap';


export default function ImagePicker({src}){
    const [imgFile, setImgFile] = useState(null);

    const imgURL = useMemo(() => {
        if (imgFile){
            return URL.createObjectURL(imgFile);
        }
        return src;
    }, [imgFile]);

    const handlePick = (e) => {
        e.preventDefault();
        setImgFile(e.target.files[0]);
    }

    return (
        <>
            <Input type="file" onChange={handlePick}/>
            <Card>
                <CardBody>
                    <CardImg src={imgURL}/>
                </CardBody>
            </Card>
        </>
    )
}