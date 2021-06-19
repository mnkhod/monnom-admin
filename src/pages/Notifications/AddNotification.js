import React, { useState, useMemo } from 'react'
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

import axios from 'axios';

function AddNotification({ onSubmit }) {

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const imageUrl = useMemo(() => {
        if (imageFile) {
            return URL.createObjectURL(imageFile)
        }
        return '';
    }, [imageFile])

    const clear = () => {
        setTitle('');
        setBody('');
        setImage(null);
    }

    const imageHandler = async e => {
        e.preventDefault()
        const imgFile = e.target.files[0]
        setImageFile(imgFile)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (onSubmit) {
            await onSubmit({
                title,
                body,
                image
            })
            clear();
        }
    }

    return (
        <Form>
            <FormGroup>
                <Label>Гарчиг</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormGroup>
            <FormGroup>
                <Label>Мессеж</Label>
                <Input value={body} onChange={(e) => setBody(e.target.value)} />
            </FormGroup>
            {/* <FormGroup>
                <Label>Зураг</Label>
                <Input type="file" onChange={imageHandler} accept={"image/png, image/gif, image/jpeg"} />
                <img style={{ width: '20rem' }} src={imageUrl} />
            </FormGroup> */}
            <div style={{ textAlign: 'end' }}>
                <Button onClick={handleSubmit} color="primary">Notification илгээх</Button>
            </div>
        </Form>
    )
}

export default AddNotification

