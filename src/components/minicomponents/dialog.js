import React from "react";

export default class DialogComponent extends React.Component {
  onOKButtonClicked = () => {
    this.props.dialogAction();
    this.props.dismissDialog();
  }

  render() {
    return (
      <div className={`container-fluid emr-dialog-backdrop ${this.props.showDialog ? "show" : ""}`}>
        <div className="row g-0">
          <div className="offset-lg-4 col-lg-4 offset-md-2 offset-md-8">
            <div className="emr-dialog">
              <div className="emr-dialog-title">
                <h2 className="emr-headers emr-dialog-title-text">
                  {this.props.dialogTitle ? this.props.dialogTitle.toUpperCase() : "UNTITLED"}
                </h2>
              </div>
              <div className="emr-dialog-details">
                <p className="emr-dialog-details-text">
                  {this.props.dialogMessage ? this.props.dialogMessage :
                    "Oops! No details to show. Kindly cancel this dialog window"}
                </p>
              </div>
              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <button className="emr-dialog-cancel-button"
                      onClick={this.props.dismissDialog}>Cancel</button>
                  </div>
                  <div className="col">
                    <button className="emr-dialog-ok-button"
                      onClick={this.onOKButtonClicked}>OK</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}