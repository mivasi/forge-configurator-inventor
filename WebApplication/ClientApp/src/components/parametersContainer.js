/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Design Automation team for Inventor
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux';
import './parametersContainer.css';
import Parameter from './parameter';
import { getActiveProject, getParameters, getUpdateParameters, modalProgressShowing, updateFailedShowing, errorData, getProfile } from '../reducers/mainReducer';
import { fetchParameters, resetParameters, updateModelWithParameters } from '../actions/parametersActions';
import { showModalProgress, showUpdateFailed, invalidateDrawing } from '../actions/uiFlagsActions';
import Button from '@hig/button';
import Tooltip from '@hig/tooltip';
import { Alert24 } from "@hig/icons";

import ModalProgress from './modalProgress';
import ModalFail from './modalFail';
import { fullWarningMsg } from '../utils/conversion';
import { axios } from 'axios';
import ReactDOM from "react-dom";
import alertify from "alertifyjs";

export class ParametersContainer extends Component {

    state = {
        IsUpdateOnViewer: false
    }

    componentDidMount() {
        this.props.fetchParameters(this.props.activeProject.id);
    }

    componentDidUpdate(prevProps) {
        // fetch parameters when params UI was active before projects initialized
        if (this.props.activeProject.id !== prevProps.activeProject.id)
            this.props.fetchParameters(this.props.activeProject.id);
    }

    updateClicked() {
        this.props.updateModelWithParameters(this.props.activeProject.id, this.props.projectUpdateParameters);
        // mark drawing as not valid if any available
        this.props.invalidateDrawing();
        this.setState({ IsUpdateOnViewer: true });
        alertify.success("Your model is being updated.Please wait", 3);
    }

    onUpdateFailedCloseClick() {
        this.props.showUpdateFailed(false);
    }

    onModalProgressClose() {
        this.props.hideModalProgress();
    }

    // Create Order Post Function
    createOrder(user) {
        if (/*this.state.IsUpdateOnViewer*/true) {
            const axios = require('axios');
            axios.post('https://codeokingsleytest.azurewebsites.net/api/order?json=' + JSON.stringify({
                username: user,
                projectID: this.props.activeProject.id,
                hash: this.props.activeProject.hash,
                datetime: Date().toLocaleString()
            })).then(resp => {
                console.log(resp.data);
                console.log(user);
            }).catch(error => {
                console.log(error);
                console.log("asdsa");
            });
            alertify.success("Your order has been received", 5);
            this.setState({ IsUpdateOnViewer: false });
        }
        else {
            alertify.error("You must update the model first", 3);
        }

    }

    onCreateOrder = () => {
        if (/*this.state.IsUpdateOnViewer*/true) {
            let modelName = this.props.projectUpdateParameters[0].value;
            let Width = parseFloat(this.props.projectUpdateParameters[1].value.replace("mm", ""));
            let Length = parseFloat(this.props.projectUpdateParameters[2].value.replace("mm", ""));
            let Height = parseFloat(this.props.projectUpdateParameters[3].value.replace("mm", ""));
            let date = new Date();

            let orderDetail = {
                username: this.props.profile.name,
                projectID: this.props.activeProject.id,
                hash: this.props.activeProject.hash,
                datetime: Date().toLocaleString(),
                model: modelName+ "-" + Width + "-" + Length + "-" + Height+ "-" + date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()+"-"+date.getHours()+":"+date.getMinutes()
            }

            fetch('https://codeokingsleytest.azurewebsites.net/api/order', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(orderDetail)
            }).then(resp => {
                console.log(resp.data);
            }).catch(error => {
                console.log(error);
            });
        }
        else {
            alertify.error("You must update the model first", 3);
        }

    }



    render() {
        const parameterList = this.props.activeProject ? this.props.projectUpdateParameters : [];
        const buttonsContainerClass = parameterList ? "buttonsContainer" : "buttonsContainer hidden";

        // if model adopted with warning - then button should became white and have a tooltip with warning details
        const adoptWarning = this.props.adoptWarning;
        const tooltipProps = adoptWarning ? { openOnHover: true, content: () => <div className="warningButtonTooltip">{adoptWarning}</div> } : { open: false };
        const buttonProps = adoptWarning ? { type: "secondary", icon: <Alert24 style={{ color: "orange" }} /> } : { type: "primary" };

        return (
            <div className="parametersContainer">
                <div className="pencilContainer">
                </div>
                <div className="parameters">
                    {
                        parameterList ?
                            parameterList.map((parameter, index) => (<Parameter key={index} parameter={parameter} />))
                            : "No parameters"
                    }

                    <div className={buttonsContainerClass}>
                        <Button style={{ width: '125px' }}
                            size="standard"
                            title="Reset"
                            type="secondary"
                            width="grow"
                            onClick={() => { this.props.resetParameters(this.props.activeProject.id, this.props.projectSourceParameters); }}
                        />
                        <div style={{ width: '14px' }} />
                        <div width="grow" /*this div makes the size of the Button below not to be broken by the encapsulating Tooltip*/>
                            <Tooltip {...tooltipProps} className="paramTooltip" anchorPoint="top-center">
                                <Button id="updateButton"
                                    style={{ width: '125px' }}
                                    {...buttonProps}
                                    size="standard"
                                    title="Update"
                                    width="grow"
                                    onClick={() => this.updateClicked()} />
                            </Tooltip>
                        </div>


                        {this.props.modalProgressShowing &&
                            <ModalProgress
                                open={this.props.modalProgressShowing}
                                title="Updating Project"
                                doneTitle="Update Finished"
                                label={this.props.activeProject.id}
                                icon="/Assembly_icon.svg"
                                onClose={() => this.onModalProgressClose()}
                                warningMsg={this.props.adoptWarning}
                            />
                        }
                        {this.props.updateFailedShowing &&
                            <ModalFail
                                open={this.props.updateFailedShowing}
                                title="Update Failed"
                                contentName="Project:"
                                label={this.props.activeProject.id}
                                onClose={() => this.onUpdateFailedCloseClick()}
                                errorData={this.props.errorData} />
                        }
                    </div>
                </div>

                {/* Create Order Button */}
                <hr className="parametersSeparator" />
                <div className={buttonsContainerClass}>
                    <div style={{ width: '14px' }} />
                    <div width="grow" /*this div makes the size of the Button below not to be broken by the encapsulating Tooltip*/>
                        <Tooltip {...tooltipProps} className="paramTooltip" anchorPoint="top-center">
                            <Button id="createOrderButton"
                                style={{ width: '230px' }}
                                {...buttonProps}
                                size="standard"
                                title="Create Order"
                                width="grow"
                                onClick={() => this.onCreateOrder()}
                            />
                        </Tooltip>
                    </div>
                </div>


            </div>
        );
    }
}

/* istanbul ignore next */
export default connect(function (store) {
    const activeProject = getActiveProject(store);
    const adoptWarning = fullWarningMsg(activeProject.adoptWarnings);

    return {
        activeProject: activeProject,
        modalProgressShowing: modalProgressShowing(store),
        updateFailedShowing: updateFailedShowing(store),
        errorData: errorData(store),
        projectSourceParameters: getParameters(activeProject.id, store),
        projectUpdateParameters: getUpdateParameters(activeProject.id, store),
        adoptWarning: adoptWarning,
        profile: getProfile(store)
    };
}, {
    fetchParameters, resetParameters, updateModelWithParameters, showModalProgress, showUpdateFailed, invalidateDrawing,
    hideModalProgress: () => async (dispatch) => { dispatch(showModalProgress(false)); }
})(ParametersContainer);
