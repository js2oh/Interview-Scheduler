import { useEffect, useReducer } from "react";
import axios from "axios";

import { reducer, actions } from "reducers/application";

const { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } = actions;

export default function useApplicationData() {

  function bookInterview(id, interview, isCreate) {
    return axios.put(`/api/appointments/${id}`, { interview, isCreate })
      .then(()=>{
        dispatch({type: SET_INTERVIEW, id, interview});
      });
  }

  function cancelInterview(id) {
    return axios.delete(`api/appointments/${id}`)
    .then(()=>{
      dispatch({type: SET_INTERVIEW, id, interview: null});
    });
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  /* Data Api Example */
  // useEffect(() => {
  //   axios.get(`/api/days`).then((response) => {
  //     setDays(response.data);
  //   });
  // }, []);

  useEffect(() => {
    async function fetchData() {
      const [days, appointments, interviewers] = await Promise.all([
        axios.get(`/api/days`),
        axios.get(`/api/appointments`),
        axios.get(`/api/interviewers`),
      ]);
      dispatch({ type: SET_APPLICATION_DATA, days: days.data, appointments: appointments.data,  interviewers: interviewers.data });
    }
    fetchData();
  }, []);

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        dispatch(data);
      }
    };
    return () => { socket.close(); };
  }, []);

  return { state, setDay, bookInterview, cancelInterview }
}