import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

export default class ModalCreatePart extends Component {
    constructor(props) {
        super(props);
    }


    //onclick create part
    onClickCreatePart(){
        let part = {
            partNumber: this.props.profile.name,
            customer: this.props.activeProject.id,
           }

        fetch('https://codeokingsleytest.azurewebsites.net/api/order', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(part)
        }).then(resp => {
            console.log(resp.data);
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <div>
                <Modal
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Create Part
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="quotationSelect">
                                <Form.Label>Select Quotation</Form.Label>
                                <Form.Control as="select" custom>
                                    <option>QN-0004750</option>
                                    <option>QN-0004749</option>
                                    <option>QN-0004748</option>
                                    <option>QN-0004747</option>
                                    <option>QN-0004746</option>
                                    <option>{this.props.data.projectUpdateParameters[0].value}</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="customerSelect">
                                <Form.Label>Select Customer</Form.Label>
                                <Form.Control as="select" custom>
                                    <option>Codeo</option>
                                    <option>123</option>
                                    <option>abc</option>
                                    <option>test</option>
                                    <option>zxc</option>
                                </Form.Control>
                            </Form.Group>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" >Create Part</Button>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
