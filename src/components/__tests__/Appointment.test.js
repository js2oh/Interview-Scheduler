/*
  We are rendering `<Application />` down below, so we need React.createElement
*/
import React from "react";

/*
  We import our helper functions from the react-testing-library
  The render function allows us to render Components
*/
import { render } from "@testing-library/react";

/*
  We import the component that we are testing
*/
import Appointment from "components/Appointment";

/*
  A test that renders a React Component
*/
describe("Appointment", () => {
  it("renders without crashing", () => {
    const fakeState = {
      key: 1,
      id: 1,
      time: "12pm",
      interview: {
        "student": "Lydia Miller-Jones",
        "interviewer": "Sylvia Palmer"
      },
      interviewers: {
        "1": {  
          "id": 1,
          "name": "Sylvia Palmer",
          "avatar": "https://i.imgur.com/LpaY82x.png"
        },
        "2": {
          id: 2,
          name: "Tori Malcolm",
          avatar: "https://i.imgur.com/Nmx0Qxo.png"
        }
      },
      bookInterview: jest.fn(),
      cancelInterview: jest.fn()
    };
    render(<Appointment {...fakeState} />);
  });
});