import React, { useEffect } from 'react'

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Status from "components/Appointment/Status";
import Form from "components/Appointment/Form";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode";

// Constants
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETING = "DELETING";
const EDIT = "EDIT";
const ERROR_SAVE="ERROR_SAVE";
const ERROR_DELETE="ERROR_DELETE";

export default function Appointment(props) {
  function saveAppointment(name, interviewer) {
     const interview = {
      student: name,
      interviewer
    };

    const isCreate = (modeObject.mode === CREATE) ? true : false;

    modeObject.transition(SAVING);

    props.bookInterview(props.id, interview, isCreate)
    .then(()=>{
        modeObject.transition(SHOW);
      }
    ).catch((err)=>{
      console.error(err);
      modeObject.transition(ERROR_SAVE, true);
    });
  }

  function deleteAppointment() {
    modeObject.transition(DELETING, true);
    props.cancelInterview(props.id)
    .then(()=>{
      modeObject.transition(EMPTY);
    })
    .catch((err)=>{
      console.error(err);
      modeObject.transition(ERROR_DELETE, true);
    });
  }

  function cancel() {
    modeObject.back();
  }

  function confirmDelete() {
    modeObject.transition(CONFIRM);
  }

  function edit() {
    modeObject.transition(EDIT);
  }

  let inputMode = (props.interview) ? SHOW : EMPTY;
  
  const modeObject = useVisualMode(inputMode);

  useEffect(() => {
    if (props.interview) modeObject.transition(SHOW);
    else modeObject.transition(EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.interview]);

  return (
    // <article className="appointment">{props.time ? `Appointment at ${props.time}` : 'No Appointments'}</article>
    <article className="appointment" data-testid="appointment">
      <Header time={props.time}></Header>
      {modeObject.mode === EMPTY && props.time !== "5pm" && (
        <Empty onAdd={() => modeObject.transition(CREATE)} />
      )}
      {modeObject.mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDelete}
          onEdit={edit}
        />
      )}
      {modeObject.mode === CREATE && (
        <Form 
          interviewers={props.interviewers}
          onSave={saveAppointment}
          onCancel={cancel}
        />
      )}
      {modeObject.mode === EDIT && (
        <Form 
          interviewers={props.interviewers}
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          onSave={saveAppointment}
          onCancel={cancel}
        />
      )}
      {modeObject.mode === SAVING && (
        <Status
          message={`Saving`}
        />
      )}
      {modeObject.mode === DELETING && (
        <Status
          message={`Deleting`}
        />
      )}
      {modeObject.mode === CONFIRM && (
        <Confirm
          message={`Are you sure you would like to delete?`}
          onCancel={cancel}
          onConfirm={deleteAppointment}
        />
      )}
      {modeObject.mode === ERROR_SAVE && (
        <Error
          message={`Could not save the appointment.`}
          onClose={cancel}
        />
      )}
      {modeObject.mode === ERROR_DELETE && (
        <Error
          message={`Could not cancel the appointment.`}
          onClose={cancel}
        />
      )}
    </article>
  );
}