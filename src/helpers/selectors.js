function getAppointmentsForDay(state, day) {
  if (!(state && state.days)) return [];
  const foundDay = state.days.find(x => x.name === day);
  if (!(foundDay && foundDay.appointments && state.appointments)) return [];
  return foundDay.appointments.map(x => state.appointments[`${x}`]);
}

function getInterview(state, interview) {
  if (!(interview && interview.interviewer && state.interviewers)) return null;
  return { ...interview, interviewer: state.interviewers[interview.interviewer]};
}

function getInterviewersForDay(state, day) {
  if (!(state && state.days)) return [];
  const foundDay = state.days.find(x => x.name === day);
  if (!(foundDay && foundDay.interviewers && state.interviewers)) return [];
  return foundDay.interviewers.map(x => state.interviewers[`${x}`]);
}

export { getAppointmentsForDay, getInterview, getInterviewersForDay }