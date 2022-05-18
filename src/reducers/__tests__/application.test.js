import { reducer } from "reducers/application";

const generateFixtures = function (spotsNum) {
  return {
    days: [
      {
        id: 1,
        name: "Monday",
        appointments: [1, 2],
        interviewers: [1, 2],
        spots: 1
      },
      {
        id: 2,
        name: "Tuesday",
        appointments: [3, 4],
        interviewers: [3, 4],
        spots: spotsNum
      }
    ],
    appointments: {
      "1": { id: 1, time: "12pm", interview: null },
      "2": {
        id: 2,
        time: "1pm",
        interview: { student: "Archie Cohen", interviewer: 2 }
      },
      "3": {
        id: 3,
        time: "2pm",
        interview: { student: "Leopold Silvers", interviewer: 4 }
      },
      "4": { id: 4, time: "3pm", interview: null }
    },
    interviewers: {
      "1": {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png"
      },
      "2": {
        id: 2,
        name: "Tori Malcolm",
        avatar: "https://i.imgur.com/Nmx0Qxo.png"
      },
      "3": {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png"
      },
      "4": {
        id: 4,
        name: "Cohana Roy",
        avatar: "https://i.imgur.com/FK8V841.jpg"
      }
    }
  };
}

const fixtures = generateFixtures(1);
const fixturesUpdated = generateFixtures(2);

describe("Application Reducer", () => {
  it("thows an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrow(
      /tried to reduce with unsupported action type/i
    );
  });

  it("update the spot with the reducer and the action type SET_SPOTS", () => {
    expect(reducer(fixtures, { type: "SET_SPOTS", id: 3, value: 1})).toEqual(fixturesUpdated);
  });
});