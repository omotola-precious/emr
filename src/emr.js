import React from 'react';
import './emr.css';
import AuthComponent from './components/auth';
import { AppComponent } from './components/app.js';
import { getAppointment, getFreshPatient, getOldAppointment, parseOldPatient, patient } from './models/patient';
import { authStateObserver, signOut, signUserOut } from './modules/auth';
import DashboardComponent from './components/dashboard';
import PatientTableComponent from './components/dashboard/patient_table';
import { closeDB, createDB, createNewDoc, deleteDoc, fetchFromRemote, getOfflineDocs, updateDoc } from './modules/db';
import NotificationComponent from './components/minicomponents/notification';

export const PatientContext = React.createContext(null);

export class EMRComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      patients: [],
      patient: null,
      emrContext: "Dashboard",
      isSignedIn: false,
      showNotification: false,
      info: "",
      showDialog: false,
      dialogMessage: "",
      dialogTitle: "",
      dialogAction: this.dismissDialog.bind(this),
      authComplete: false
    }
  }

  componentDidMount() {
    authStateObserver(this.authStateChanged);
    // getOfflineDocs(this.docsFromOfflineDB);
  }

  componentWillUnmount() {
    console.log("unmount called");
    // closeDB(signUserOut());
  }

  authStateChanged = (user) => {
    if (user) {
      // console.log("firebase user => ", user);
      createDB(user);
      if (user.displayName) {
        // console.log("displayname => ", user.displayName);
        // this.continueToApp();
      }

      this.setState({
        user: user
      });

      // createDB(user);
    }
  }

  continueToApp = () => {
    this.setState({
      isSignedIn: true,
      showNotification: true,
      info: "Welcome"
    });

    fetchFromRemote(this.docsFromOfflineDB);
    // getOfflineDocs(this.docsFromOfflineDB);
  }

  signUserIn = () => { }

  onUserSignOut = () => {
    this.setState({
      user: null,
      isSignedIn: false,
      patient: null,
      patients: [],
      authComplete: false
    });
  }

  dismissNotification = () => {
    this.setState({
      showNotification: false,
      info: ""
    });
  }

  docsFromOfflineDB = (docs) => {
    //We're expecting an array of object with 'doc' as the needed key for the value
    // console.log(docs);
    const dataFromDocs = docs.map(item => item.doc);

    //if there are any updates to the data structure
    if(dataFromDocs.length > 0) this.upgradeDataStructure(dataFromDocs);

    this.setState({
      patients: dataFromDocs,
      authComplete: true
    });
  }

  upgradeDataStructure = (dataFromDocs) => {
    const currentAppointmentModel = getAppointment();
    const currentAppointmentModelKeys = Object.keys(currentAppointmentModel);
    
    const upgradedDataFromDocs = dataFromDocs.slice().forEach((item, index) => {
      let dbAppointmentKeys = [];
      //The next line is to prevent any unintended changes
      item = JSON.parse(JSON.stringify(item));
      item.appointments.map(apntmnt => {
        if(typeof apntmnt === 'object'){
          dbAppointmentKeys = Object.keys(apntmnt);
          currentAppointmentModelKeys.forEach((modelKey) => {
            // const itemExists = dbAppointmentKeys.find(key => key === modelKey);
            if(apntmnt.hasOwnProperty(modelKey)) {
              if(apntmnt[modelKey]){
                if(typeof currentAppointmentModel[modelKey] === 'object'){
                  currentAppointmentModel[modelKey].notes = apntmnt;
                }
              } else {
                apntmnt[modelKey] = currentAppointmentModel[modelKey]
              }
            }
          });
        }
      });

      console.log("Old patient data => ", item);
      parseOldPatient.call(item);
      // console.log("Corrected appointment data structure => ", item.appointment);
    });
    // console.log("db object structure => ", Object.entries(dataFromDocs[0].appointment));
    // console.log("App updated object structure => ", Object.entries(currentAppointmentModel));
    // if()
  }

  onCreateIconClicked = () => {
    const newPatient = Object.assign({}, getFreshPatient());
    this.state.patients.push(newPatient);
    this.setState({
      patient: newPatient,
      emrContext: "Patients",
      showNotification: true,
      info: "New patient created"
    });

    //TODO: create on database as well
    createNewDoc(newPatient, null);
  }

  deletePatient = (id) => {
    // console.log("state patient id => ", this.state.patient._id);
    // console.log("id => ", id);
    const undeletedPatients = this.state.patients.filter(item => item._id !== id);
    if (this.state.patient._id === id) {
      // console.log("true");
      this.setState({
        patient: null,
        patients: undeletedPatients,
        showNotification: true,
        info: `${this.state.patients.find(item => item._id === id).biodata.lastname.toUpperCase()} deleted`
      });
    } else {
      this.setState({
        patients: this.state.patients.filter(item => item._id !== id)
      });
    }

    //TODO: delete from database as well
    deleteDoc(id);
  }

  onPatientTableClicked = (id) => {
    this.setState({
      patient: this.state.patients.find((value) => id === value._id),
      emrContext: "Patients"
    });
  }

  onPatientChange = (patient) => {
    this.setState({
      patient: patient,
      showNotification: true,
      info: `Switched ${patient.biodata.firstname ? "to ".concat(patient.biodata.firstname.toUpperCase()) : "patient"}`
    });
  }

  switchBackToDashboard = () => {
    this.setState({
      patient: null,
      emrContext: "Dashboard"
    });
  }

  updateObjectField = (name, value, fields) => {
    const thisPatient = this.state.patient;
    const thisField = this.getWhereSwitched(fields);
    thisField[name] = value;
    this.setState({
      patient: thisPatient
    });

    updateDoc(thisPatient);
  }

  updateComplaints = (name, value) => {
    const thisPatient = this.state.patient;
    const complaints = thisPatient.presenting_complaint;
    complaints.notes = value;
    this.setState({
      patient: thisPatient
    });
    // console.log("complaint notes => ", value);

    updateDoc(thisPatient);
  }

  getWhereToModify = (fields, found) => {
    if (fields.length === 0) {
      return found;
    }

    found = found[fields.shift()];
    this.getWhereToModify(fields, found);
  }

  getWhereSwitched = (fields) => {
    switch (fields.length) {
      case 0:
        return this.state.patient

      case 1:
        return this.state.patient[fields[0]];

      case 2:
        return this.state.patient[fields[0]][fields[1]];

      case 3:
        return this.state.patient[fields[0]][fields[1]][fields[2]]

      case 4:
        return this.state.patient[fields[0]][fields[1]][fields[2]][fields[3]]

      default:
        break;
    }
  }

  //Update already existing past medical history sections modelled with arrays
  updateAnyObject = (name, value, fields, index) => {
    const thisPatient = this.state.patient; //the current patient in the app
    // const pmh = thisPatient.past_medical_history; //access the past medical history of the patient
    const pmhArray = this.getWhereSwitched(fields); 
    //get either hospitalization, surgery, blood transfusion and comorbidities
    let pmhArrayItem = undefined;
    if (Array.isArray(pmhArray))
      pmhArrayItem = pmhArray[index];
    else
      pmhArrayItem = pmhArray;
    pmhArrayItem[name] = value;
    this.setState({
      patient: thisPatient
    });

    updateDoc(thisPatient);
  }

  //add or remove entire items (i.e an hospitalization history) in the past medical history array
  updateItemsInArray = (fields, pmhObject, value) => {
    const thisPatient = this.state.patient;
    let pmhArray = this.getWhereSwitched(fields);
    if (typeof value === 'number') {
      if (pmhArray.length < value) {
        let additions = new Array(value - pmhArray.length).fill(pmhObject);
        if (typeof pmhObject === 'object') {
          additions = additions.map(() => JSON.parse(JSON.stringify(pmhObject)));
        }
        pmhArray.splice(pmhArray.length, 0, ...additions);
      } else {
        pmhArray.splice(value, pmhArray.length - value);
      }
      //else if there is no numeric $value supplied, it is likely string or object
    } else {
      pmhArray.splice(0, pmhArray.length, ...pmhObject);
    }

    this.setState({
      patient: thisPatient
    });

    updateDoc(thisPatient);
  }

  removeItemsInArray = (field, where) => {
    const thisPatient = this.state.patient;
    let pmhArray = thisPatient.past_medical_history[field];
    if (typeof where === 'string') {
      const itemLocation = pmhArray.findIndex((item) => item.comorbidity === where);
      pmhArray.splice(itemLocation, 0);
    }

    this.setState({
      patient: thisPatient
    });
  }

  createNewAppointment = () => {
    const appointment = getOldAppointment();
    this.state.patient.last_seen = appointment.date_seen;
    this.state.patient.appointments.unshift(appointment);
    this.switchToAppointment(appointment);
  }

  switchToAppointment = (appointment) => {
    // console.log("appointment => ", appointment);
    this.state.patient.appointment = appointment;
    this.setState({
      patient: this.state.patient
    });

    updateDoc(this.state.patient);
  }

  showDialog = (title, message, action) => {
    this.setState({
      showDialog: true,
      dialogMessage: message,
      dialogTitle: title,
      dialogAction: action
    });
  }

  dismissDialog = () => {
    this.setState({
      showDialog: false,
      dialogMessage: "",
      dialogTitle: ""
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("patient => ", this.state.patient);
    if(prevState.user === null && this.state.user){}
  }

  render() {
    //:1 => if there is a user i.e. logged in, display the app
    if (this.state.isSignedIn) {
      //:2 => if there is a selected patient, display the details
      return (
        <>
          <NotificationComponent showNotification={this.state.showNotification} 
          info={this.state.info} dismissNotification={this.dismissNotification} />
          <AppComponent currentView={this.state.patient ? "Patients" : "Dashboard"}
            dashboard={this.switchBackToDashboard} patient={this.state.patient}
            patients={this.state.patients} changePatient={this.onPatientChange}
            deletePatient={this.deletePatient}
            updateObjectField={this.updateObjectField} updateComplaints={this.updateComplaints}
            updateAnyObject={this.updateAnyObject} createNewPatient={this.onCreateIconClicked}
            updateItemsInArray={this.updateItemsInArray}
            switchToAppointment={this.switchToAppointment}
            createNewAppointment={this.createNewAppointment}
            onUserSignOut={this.onUserSignOut} showDialogOnClick={this.showDialog}
            showDialog={this.state.showDialog} dialogMessage={this.state.dialogMessage}
            dismissDialog={this.dismissDialog} dialogAction={this.state.dialogAction} 
            dialogTitle={this.state.dialogTitle} user={this.state.user}>
            {
              this.state.patient !== null ?
                null :
                <DashboardComponent
                  recents={this.state.patients.filter(patient => patient.appointments.length === 1)
                    .sort((a, b) => b._id - a._id).slice(0, 3)}
                  createNewPatient={this.onCreateIconClicked}
                  viewPatient={this.onPatientTableClicked} user={this.state.user}>
                  <PatientTableComponent patients={this.state.patients
                    .sort((a, b) => b.last_seen - a.last_seen).slice(0, 10)
                    .map((item) => {
                      item.biodata.primary_diagnosis = item.primary_diagnosis;
                      item.biodata.secondary_diagnosis = item.secondary_diagnosis;
                      item.biodata.patient_id = item._id;
                      return item.biodata;
                    })} onItemClicked={this.onPatientTableClicked} 
                      authComplete={this.state.authComplete}
                    />
                </DashboardComponent>
            }
          </AppComponent>
        </>
      )
    } else {
      return (
        <>
          <NotificationComponent />
          <AuthComponent signIn={this.signUserIn} continueToApp={this.continueToApp}
            user={this.state.user}
          />
        </>
      )
    }
  }
}