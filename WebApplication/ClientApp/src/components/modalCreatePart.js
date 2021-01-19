import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

export default class ModalCreatePart extends Component {
    constructor(props){
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
                            Create Part
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Quotation List gelecek
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
