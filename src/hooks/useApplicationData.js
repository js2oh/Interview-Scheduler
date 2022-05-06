import { useEffect, useReducer } from "react";
import axios from "axios";

import { reducer, actions } from "reducers/application";

const { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, SET_SPOTS } = actions;

const CREATE = "CREATE";
const DELETE = "DELETE";

export default function useApplicationData() {

  function updateSpots(id, value) {
    dispatch({type: SET_SPOTS, id, value});
    // setState(prev => {
    //     const dayIndex = prev.days.findIndex(day=>day.appointments.includes(id));
    //     const newDays = prev.days.map((day,i) => (i===dayIndex) ? {...day, spots: day.spots+value} : {...day});
    //     return {...prev, days: newDays};
    //   }
    // );
  }

  function bookInterview(id, interview, isCreate) {
    return axios.put(`/api/appointments/${id}`, { interview, isCreate })
      .then((res)=>{
        dispatch({type: SET_INTERVIEW, id, interview});
        // setState(prev => {
        //   return {...prev, appointments: {...prev.appointments, [id]: {...prev.appointments[id], interview}}};
        // });
      });
      // .then(()=>{
      //   if (isCreate) updateSpots(id, -1);
      // });
  }

  function cancelInterview(id) {
    return axios.delete(`api/appointments/${id}`).then(()=>{
      dispatch({type: SET_INTERVIEW, id});
      // setState(prev => {
      //   return {...prev, appointments: {...prev.appointments, [id]: {...prev.appointments[id], interview: null}}};
      // });
    });
    // .then(()=>{
    //   updateSpots(id, 1);
    // });
  }

  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // const setDay = (day) => setState({ ...state, day });
  const setDay = (day) => dispatch({ type: SET_DAY, day });

  /* Data Api Example */
  // useEffect(() => {
  //   axios.get(`/api/days`).then((response) => {
  //     setDays(response.data);
  //   });
  // }, []);

  /* Method 1: Promise Chain */
  // useEffect(() => {
  //   axios.get(`/api/days`)
  //   .then(response => {
  //     setState(prev => ({ ...prev, days: response.data}));
  //     return axios.get(`/api/appointments`);
  //   })
  //   .then(response => {
  //     setState(prev => ({ ...prev, appointments: response.data}));
  //   });
  // }, []);

  /* Method 2: Promise All */
  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`),
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
      // setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    socket.onmessage = (event) => {
      const interviewObj = JSON.parse(event.data);
      dispatch(interviewObj);
      switch (interviewObj.mode) {
        case CREATE:
          updateSpots(interviewObj.id, -1);
          break;
        case DELETE:
          updateSpots(interviewObj.id, 1);
          break;
        default:
      }
    };
    return () => { socket.close(); };
  }, []);

  return { state, setDay, bookInterview, cancelInterview }
}