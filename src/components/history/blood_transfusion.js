import React from 'react'
import { PatientContext } from '../../models/patient_context';
import SingleSelectOutputComponent from '../minicomponents/single_select_output';

export default class TransfusionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reaction: "",
      reactions: ["None", "Fever | Hyperthermia", "Required ICU admission"],
    }
  }

  static contextType = PatientContext;

  onRecoveryItemChange = (id, value) => {
    this.props.updateAnyObject(id, value,
      [this.context.last_viewed, "past_medical_history", "blood_transfusions"], this.props.index - 1);
  }

  onItemChange = (event) => {
    this.onRecoveryItemChange(event.target.name, event.target.value);
  }

  displaySelectedInInputBox = (index) => {
    let currentReaction = this.state.genderItem;
    if (currentReaction === this.state.genderItems[index]) {
      this.setState({
        genderItem: ""
      });
    } else {
      this.setState({
        genderItem: this.state.genderItems[index]
      });
    }
  }

  render() {
    const blood_transfusions = "blood_transfusions";
    return (
      <div className="emr-clerking-tab-data-item">
        <h4 className="emr-card-headers">Blood Transfusion {this.props.index}</h4>
        <div className="emr-clerking-tab-data-items">
          <div className="emr-clerking-tab-data-item">
            <label htmlFor={`transfusionvolume${this.props.index}`}>How many pints (500ml) of blood?</label>
            <input type="number" name={`pints`}
              id={`transfusionvolume${this.props.index}`}
              value={this.context[this.context.last_viewed].past_medical_history[blood_transfusions][this.props.index - 1].pints}
              onChange={this.onItemChange}></input>
          </div>
          <div className="emr-clerking-tab-data-item">
            <label htmlFor={`transfusiondonor${this.props.index}`}>Who donated blood?</label>
            <input type="text" name={`donor`}
              id={`transfusiondonor${this.props.index}`}
              value={this.context[this.context.last_viewed].past_medical_history[blood_transfusions][this.props.index - 1].donor}
              onChange={this.onItemChange}></input>
          </div>
          <div className="emr-clerking-tab-data-item">
            <label htmlFor={`transfusionfacility${this.props.index}`}>Health Facility</label>
            <input type="text" name={`facility`}
              id={`transfusionfacility${this.props.index}`}
              value={this.context[this.context.last_viewed].past_medical_history[blood_transfusions][this.props.index - 1].facility}
              placeholder="e.g UCH" onChange={this.onItemChange}></input>
          </div>
          <SingleSelectOutputComponent id={`reaction`}
            item={this.state.reaction} items={this.state.reactions}
            value={this.context[this.context.last_viewed].past_medical_history[blood_transfusions][this.props.index - 1].reaction}
            index={this.props.index} onItemChange={this.onRecoveryItemChange} />
        </div>
      </div>
    );
  }
}