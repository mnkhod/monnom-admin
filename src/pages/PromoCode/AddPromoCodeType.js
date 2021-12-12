import React, {useState} from 'react'

import moment from 'moment';
import {Card, Form, FormGroup, Input, InputGroup, Label, FormText, Button} from 'reactstrap';


export default function AddPromoCodeType({onSubmit}) {

    const [isGift, setIsGift] = useState(false)
    const [discountPercent, setDiscountPercent] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);
        onSubmit({
            name: formProps.name,
            isGift: isGift,
            discountPercent: discountPercent,
            endDate: moment(formProps.endDate).format('YYYY-MM-DD HH:mm:ss')
        })
    }

    const handleToggleGift = (value) => {
        if (value) {
            setDiscountPercent(100);
        }
        setIsGift(value)
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="exampleEmail">Төрлийн нэр</Label>
                    <Input name="name" required placeholder="Үнэгүй" />
                </FormGroup>
                <FormGroup check className='mb-3 mt-1'>
                    <Label check>
                        <Input onChange={(e) => handleToggleGift(e.target.checked)} checked={isGift} name='isGift' type="checkbox" />{' '}
                        Бэлэг
                    </Label>
                </FormGroup>
                {isGift? (<></>):(
                    <FormGroup>
                        <Label for="discountPercent">Хямдралын хувь %</Label>
                        <Input min={0} max={100} readOnly={isGift} name="discountPercent" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} required type="number" id="discountPercent" placeholder="50" />
                    </FormGroup>
                )}
                <Button color='primary'>Промо кодын төрөл үүсгэх</Button>
            </Form>
        </div>
    )
}
