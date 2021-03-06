import React, { useState } from 'react';

import Button from "../Button"
import InterviewerList from "../InterviewList"

export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  const changeStudent = (event) => setStudent(event.target.value);
  
  const reset = () => {
    setStudent(""); 
    setInterviewer("");
    setError("");
  };

  const cancel = () => {
    reset();
    props.onCancel();
  }

  // const save = () => {
  //   if (student && interviewer) props.onSave(student, interviewer);
  // }

  // Disabling default behaviour: const disableDefault = (event) => {event.preventDefault()};
  const disableEnter = (event) => {event.key === 'Enter' && event.preventDefault();}

  const validate = () => {
    if (!student || student === "") {
      setError("Student name cannot be blank");
      return;
    }
    if (!interviewer) {
      setError("Interviewer must be selected");
      return;
    }
    setError("");
    props.onSave(student, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" /*onSubmit={disableDefault}*/>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            /*
              This must be a controlled component
              your code goes here
            */
            value={student}
            onChange={changeStudent}
            onKeyDown={disableEnter}
            data-testid="student-name-input"
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList 
          /* your code goes here */
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={validate}>Save</Button>
        </section>
      </section>
    </main>
  );
}
