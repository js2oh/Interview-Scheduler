import React from "react";

import "components/InterviewListItem.scss";

import classNames from "classnames";

export default function InterviewListItem(props) {

  let interviewListClass = classNames('interviewers__item', {'interviewers__item--selected': props.selected});

  return (
    <li className={interviewListClass} onClick={props.setInterviewer} data-testid="interviewer">
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
       {props.selected > 0 && props.name}
    </li>
  );
}