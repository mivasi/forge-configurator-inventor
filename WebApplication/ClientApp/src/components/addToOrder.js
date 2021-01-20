import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

export default class AddToOrder extends Component {
    constructor(props) {
        super(props);
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
                            Add To Order
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="partSelect">
                                <Form.Label>Select Part</Form.Label>
                                <Form.Control as="select" custom>
                                    <option>Part-1</option>
                                    <option>Part-2</option>
                                    <option>Part-3</option>
                                    <option>Part-4</option>
                                    <option>Part-5</option>
                                    <option>{this.props.props.activeProject.id}</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="quantitySelect">
                                <Form.Label>Select Quantity</Form.Label>
                                <Form.Control type="number" defaultValue="1" min="1" max="1000">
                                </Form.Control>
                            </Form.Group>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.props.onCreateOrder} >Create Order</Button>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
