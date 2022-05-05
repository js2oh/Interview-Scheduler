import React from "react";
import PropTypes from "prop-types";

import "components/InterviewList.scss";

import InterviewListItem from "components/InterviewListItem";

InterviewList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default function InterviewList(props) {
  let interviewListItems = props.interviewers.map((interviewer) => 
    <InterviewListItem
      key={interviewer.id}
      id={interviewer.id}
      name={interviewer.name} 
      avatar={interviewer.avatar} 
      selected={interviewer.id === props.value}
      setInterviewer={() => {
        if (interviewer.id === props.value) props.onChange(null);
        else props.onChange(interviewer.id);
      }}   
    />
  );

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewListItems}</ul>
    </section>
  );
}