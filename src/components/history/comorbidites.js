import React from "react";
import LabelAndInputComponent from "../epilepsy/label_and_input";
import SingleSelectOutputComponent from "../minicomponents/single_select_output";

export default class Comorbidities extends React.Component {
  onItemChange = (id, value) => {
    this.props.updateAnyObject(id, value, [this.props.last_viewed,
      "past_medical_history", "comorbidities"], this.props.index);
  }

  render() {
    return (
      <div className="emr-clerking-tab-data-item">
        <label htmlFor={this.props.comorbidity.toLowerCase()}>{this.props.comorbidity}</label>
        {/* Next list level */}
        <div className="emr-clerking-tab-data-items">
          <LabelAndInputComponent id="age_diagnosed" type="number" title={"Age at onset (in years)"}
            value={this.props.value.hasOwnProperty("age_diagnosed") ? 
            this.props.value.age_diagnosed : ""} onItemChange={this.onItemChange} />
          <LabelAndInputComponent id="year_diagnosed" type="number" title={"Year of Diagnosis"}
            value={this.props.value.year_diagnosed} onItemChange={this.onItemChange} />
          <LabelAndInputComponent id="duration" type="number"
            title={"Years lived with " + this.props.comorbidity}
            value={this.props.value.duration} onItemChange={this.onItemChange} />
          <LabelAndInputComponent id="treatment" title="Treatment" type="text"
            value={this.props.value.treatment} onItemChange={this.onItemChange} />
          <SingleSelectOutputComponent name={"Compliance"} id={"compliance"}
            items={["None", "Compliant"]} onItemChange={this.onItemChange}
            value={this.props.value.compliance} />
          <SingleSelectOutputComponent name={"Response to treatment"} id={"response"}
            items={["Not Responsive", "Responsive"]} onItemChange={this.onItemChange}
            value={this.props.value.response} />
        </div>
      </div>
    )
  }
}