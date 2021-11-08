import React from "react";
import { PatientContext } from "../../models/patient_context";
import LabelAndInputComponent from "../epilepsy/label_and_input";
import MultiSelectOutputComponent from "../minicomponents/multi_select_output";
import NotesComponent from "../minicomponents/notes";

export default class FSHxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      positiveFamilyHistory: [],
      familyHistory: ["Hypertension", "Diabetes Mellitus", "Asthma", "Peptic Ulcer Dx", "Epilepsy"]
    }
  }

  static contextType = PatientContext;

  onItemChange = (id, value) => {
    this.props.updateItemsInArray([id], value.split(", "), null);
    // this.props.updateAnyObject(id, )
  }

  onAlcoholItemChange = (id, value) => {
    console.log("id => ", id);
    this.props.updateItemsInArray(["alcohol", id], value.split(", "), null);
  }

  onObjectItemChange = (id, value) => {
    console.log("this.onObjectItemChange");
    console.log("values => ", Object.values(this.context.alcohol));
    if (id.includes("alcohol")) {
      this.props.updateAnyObject(id, value, ["alcohol"], null);
    }

    if (id.includes("cigarette")) {
      this.props.updateAnyObject(id, value, ["cigarette"], null);
    }

    if (id.includes("note")) {
      this.props.updateAnyObject(id, value, [], null);
    }
  }

  displayPositivesInInputBox = (index) => {
    const positiveFamilyHistory = this.state.familyHistory[index];
    const positiveFamilyHistories = this.state.positiveFamilyHistory.slice();
    const alreadyExists = this.state.positiveFamilyHistory.find((contents) => contents === positiveFamilyHistory);
    if (alreadyExists) {
      this.setState({
        positiveFamilyHistory: this.state.positiveFamilyHistory.filter((value) => value !== positiveFamilyHistory)
      });
    } else {
      positiveFamilyHistories.push(positiveFamilyHistory);
      this.setState({
        positiveFamilyHistory: positiveFamilyHistories
      });
    }
  }

  render() {
    // const positiveFamilyHistory = this.state.positiveFamilyHistory.join(", ");
    return (
      <div className="emr-clerking-tab-data m-0">
        <h4 className="emr-card-headers">Family and Social History</h4>
        <div className="emr-clerking-tab-data-items">
          <MultiSelectOutputComponent name={"Family History"} id={"family_history"}
            items={["Hypertension", "Diabetes Mellitus", "Asthma",
              "Peptic Ulcer Dx", "Epilepsy"]}
            value={this.context.family_history.join(", ")}
            onItemChange={this.onItemChange} displayInBox={this.displayPositivesInInputBox} />
          {/* <div className="emr-clerking-tab-data-item">
            <label htmlFor="familyhistory">Family History of any of the following?</label>
            <MultiItemSelectComponent selectableItems={this.state.familyHistory} displayInBox={this.displayPositivesInInputBox} />
            <input type="text" name="familyhistory" id="familyhistory" defaultValue={positiveFamilyHistory}></input>
          </div> */}
          <details className="emr-clerking-tab-data-item"
            open={Object.values(this.context.alcohol).find(item => item !== "")}>
            <summary htmlFor="hypertension">Alcohol Consumption</summary>
            {/* <!-- Next list level --> */}
            <div className="emr-clerking-tab-data-items">
              <MultiSelectOutputComponent id={"alcoholtype"}
                name={"What kind of alcohol is consumed?"}
                items={["Beer", "Red wine", "Whiskey", "Brandy", "Vodka"]}
                value={this.context.alcohol.alcoholtype.join(", ")}
                onItemChange={this.onAlcoholItemChange} />
              <LabelAndInputComponent id={"alcoholbottlesperweek"}
                title={"Number of bottles consumed per week"} type={"number"}
                value={this.context.alcohol.alcoholbottlesperweek}
                onItemChange={this.onObjectItemChange} />
              <LabelAndInputComponent id={"alcoholbottlesize"}
                title={"Size of each bottle (in ml)"} type={"number"}
                value={this.context.alcohol.alcoholbottlesize}
                onItemChange={this.onObjectItemChange} />
              <LabelAndInputComponent id={"alcoholconsumptionduration"}
                title={"Total duration of alcohol consumption (in years)"} type={"number"}
                value={this.context.alcohol.alcoholconsumptionduration}
                onItemChange={this.onObjectItemChange} />
            </div>
          </details>
          <details className="emr-clerking-tab-data-item"
            open={Object.values(this.context.cigarette).find(item => item !== "")}>
            <summary htmlFor="hypertension">Cigarette Smoking</summary>
            {/* <!-- Next list level --> */}
            <div className="emr-clerking-tab-data-items">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    <LabelAndInputComponent id={"cigarettesticksperday"}
                      title={"Number of sticks per day"} type={"number"}
                      value={this.context.cigarette.cigarettesticksperday}
                      onItemChange={this.onObjectItemChange} />
                  </div>
                  <div className="col-md-6">
                    <LabelAndInputComponent id={"cigarettesmokingduration"}
                      title={"Total duration of cigarette smoking (in years)"} type={"number"}
                      value={this.context.cigarette.cigarettesmokingduration}
                      onItemChange={this.onObjectItemChange} />
                  </div>
                </div>
              </div>
            </div>
          </details>
          <NotesComponent id={"fshx_notes"} value={this.context.fshx_notes} fields={[]}
            onItemChange={this.props.updateAnyObject} />
        </div>
      </div>
    );
  }
}