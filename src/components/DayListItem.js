import React from "react";

import "components/DayListItem.scss";

import classNames from "classnames";

export default function DayListItem(props) {

  const formatSpots = (numSpots) => {
    if (numSpots) return (numSpots !== 1) ? `${numSpots} spots remaining` : `${numSpots} spot remaining`;
    else return `no spots remaining`;
  };

  let dayListClass = classNames('day-list__item', {'day-list__item--selected': props.selected, 'day-list__item--full': !props.spots});

  return (
    <li className={dayListClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}