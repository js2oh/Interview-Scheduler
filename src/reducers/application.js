const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS";

export const actions = { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, SET_SPOTS };

export function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    case SET_INTERVIEW: {
      return {...state, appointments: {...state.appointments, [action.id]: {...state.appointments[action.id], interview: action.interview}}};
    }
    case SET_SPOTS: {
      const dayIndex = state.days.findIndex(day=>day.appointments.includes(action.id));
      const newDays = state.days.map((day,i) => (i===dayIndex) ? {...day, spots: day.spots+action.value} : {...day});
      return {...state, days: newDays};
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
