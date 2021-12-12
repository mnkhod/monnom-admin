import moment from 'moment';
import React from 'react'
import {Card, Form, FormGroup, Input, InputGroup, Label, FormText, Button, Progress} from 'reactstrap';


export default function GeneratePromoCodes({onSubmit, product}) {

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);
        onSubmit({
            size: formProps.size,
            endDate: moment(formProps.endDate).format('YYYY-MM-DD HH:mm:ss')
        })
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="exampleEmail">Тоо ширхэг</Label>
                    <Input name="size" type="number" required required placeholder="1000" />
                </FormGroup>
                {product.is_discount ? (
                    <FormGroup>
                        <Label for="exampleEmail">Хямдралын хувь:</Label>
                        <h5><b>{product?.discount_percent}%</b></h5>
                    </FormGroup>
                ):(<></>)}
                <FormGroup>
                    <Label for="endDate">Дуусах огноо</Label>
                    <Input name="endDate" required type="date" id="endDate" />
                </FormGroup>
                <Button color='primary'>{getActionName(product)}</Button>
            </Form>
        </div>
    )

    function getActionName(product) {
        if (product?.is_discount) {
            return 'Хямдралын Промо кодууд үүсгэх'
        }
        if (product?.is_gift) {
            return 'Бэлгийн Промо кодууд үүсгэх'
        }
        return ``;
    }
}
