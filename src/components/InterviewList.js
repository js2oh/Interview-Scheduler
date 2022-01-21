import React from "react";

import "components/InterviewList.scss";

import InterviewListItem from "components/InterviewListItem";

export default function InterviewList(props) {
  let interviewListItems = props.interviewers.map((interviewer) => 
    <InterviewListItem
      key={interviewer.id}
      id={interviewer.id}
      name={interviewer.name} 
      avatar={interviewer.avatar} 
      selected={interviewer.id === props.value}
      setInterviewer={() => props.onChange(interviewer.id)}   
    />
  );

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewListItems}</ul>
    </section>
  );
}