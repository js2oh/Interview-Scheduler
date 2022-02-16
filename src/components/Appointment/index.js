import React from 'react'

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {

  // Constants
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";

  let inputMode = EMPTY;

  if (props.interview) inputMode = SHOW;
  else inputMode = EMPTY;

  const modeObject = useVisualMode(inputMode);

  return (
    // <article className="appointment">{props.time ? `Appointment at ${props.time}` : 'No Appointments'}</article>
    <article className="appointment">
      <Header time={props.time}></Header>
      {modeObject.mode === EMPTY && <Empty onAdd={() => modeObject.transition(CREATE)} />}
      {modeObject.mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {modeObject.mode === CREATE && (
        <Form 
          interviewers={props.interviewers}
          onSave={() => console.log("SAVE")}
          onCancel={() => modeObject.back()}
        />
      )}
    </article>
  );
}