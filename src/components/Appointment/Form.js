import React, { useState } from 'react';

import Button from "../Button"
import InterviewerList from "../InterviewList"

export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  const changeStudent = (event) => setStudent(event.target.value);
  
  const reset = () => {
    setStudent(""); 
    setInterviewer("");
  };

  const cancel = () => {
    reset();
    props.onCancel();
  }

  // const disableDefault = (event) => {event.preventDefault()};
  const disableEnter = (event) => {event.key === 'Enter' && event.preventDefault();}

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
          />
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
          <Button confirm onClick={props.onSave}>Save</Button>
        </section>
      </section>
    </main>
  );
}
