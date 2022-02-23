import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  function updateSpots(id, num) {
    setState(prev => {
        const dayIndex = prev.days.findIndex(day=>day.appointments.includes(id));
        const newDays = prev.days.map((day,i) => (i===dayIndex) ? {...day, spots: day.spots+num} : {...day});
        return {...prev, days: newDays};
      }
    );
  }

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then((res)=>{
        setState(prev => {
          return {...prev, appointments: {...prev.appointments, [id]: {...prev.appointments[id], interview}}};
        });
      })
      .then(()=>{
        updateSpots(id, -1);
      });
  }

  function cancelInterview(id) {
    return axios.delete(`api/appointments/${id}`).then(()=>{
      setState(prev => {
        return {...prev, appointments: {...prev.appointments, [id]: {...prev.appointments[id], interview: null}}};
      });
    })
    .then(()=>{
      updateSpots(id, 1);
    });
  }

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = (day) => setState({ ...state, day });

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
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview }
}