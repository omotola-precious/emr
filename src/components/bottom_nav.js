import React from "react";
import './nav.css';

export default class BottomNavComponent extends React.Component {
  render() {
    return (
      <div className="container-fluid emr-bottom-nav d-lg-none">
        <div className="row g-0 align-items-center emr-bottom-nav-row flex-nowrap">
          {
            [
              ["History", "bi-file-earmark-medical-fill"],
              ["Epilepsy Questionnaire", "bi-question-circle-fill"],
              ["Other Forms", "bi-code-square"],
              ["Examination", "bi-wrench"],
              ["Investigation", "bi-card-image"],
              ["Assessment", "bi-lightbulb-fill"],
              ["Treatment", "bi-check-circle-fill"]
            ].map((item, index) =>
              <div className="col-3 emr-app-toolbar d-flex justify-content-center" key={item[0]}>
                <div className={`emr-icon-bg ${this.props.navIndex === index ? "selected" : ""}`}
                  key={index} onClick={this.props.changeState.bind(this, index)}>
                  <i className={`bi ${item[1]} emr-icons emr-center-icon`}></i>
                  <i className="emr-icon-tooltip">{item[0]}</i>
                </div>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}