import React from "react";

import { render, fireEvent, getAllByTestId, getByAltText, queryByText, getByText } from "@testing-library/react";

import Form from "components/Appointment/Form";

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    },
    {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png"
    }
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} student="Lydia Miller-Jones" />
    );
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name is not blank", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();

    /* 2. Render the Form with interviewers, interviewer, and the onSave mock function passed as an onSave prop, the student prop should be blank or undefined */
    const { getByText } = render(
      <Form interviewers={interviewers} interviewer={1} onSave={onSave} />
    );

    /* 3. Click the save button */
    fireEvent.click(getByText("Save"));

    /* 4. validation is shown */
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();

    /* 5. onSave is not called */
    expect(onSave).not.toHaveBeenCalled();
  });

  it("validates that the interviewer is not selected", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();

    /* 2. Render the Form with interviewers, student, and the onSave mock function passed as an onSave prop, the interviewer prop should be blank or undefined */
    const { getByText } = render(
      <Form interviewers={interviewers} student="Lydia Miller-Jones" onSave={onSave} />
    );

    /* 3. Click the save button */
    fireEvent.click(getByText("Save"));

    /* 4. validation is shown */
    expect(getByText(/Interviewer must be selected/i)).toBeInTheDocument();
  
    /* 5. onSave is not called */
    expect(onSave).not.toHaveBeenCalled();
  });

  it("can successfully save after trying to submit an empty student name", () => {
    /* 1. Create the mock onSave function */
    const onSave = jest.fn();

    /* 2. Render the Form with interviewers, interviewer, and the onSave mock function passed as an onSave prop */
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} interviewer={1} onSave={onSave} />
    );

    /* 3. Click the save button */
    fireEvent.click(getByText("Save"));

    /* 4. validation is shown */
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();

    /* 5. onSave is not called */
    expect(onSave).not.toHaveBeenCalled();

    /* 6. Type the student name and click the save button */
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByText("Save"));

    /* 7. validation is not shown */
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(queryByText(/Interviewer must be selected/i)).toBeNull();

    /* 8. onSave is called with the correct arguments */
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });

  it("calls onCancel and resets the input field", () => {
    const onCancel = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        interviewer={1}
        name="Lydia Mill-Jones"
        onSave={jest.fn()}
        onCancel={onCancel}
      />
    );
  
    fireEvent.click(getByText("Save"));
  
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
  
    fireEvent.click(getByText("Cancel"));
  
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(queryByText(/Interviewer must be selected/i)).toBeNull();
  
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("select and unselect interviewers", () => {
    /* 1. Render the Form with interviewers */
    const { container } = render(<Form interviewers={interviewers} />);

    // 2. get InterviewListItem elements in an array.
    const interviews = getAllByTestId(container, "interviewer");

    // 3. click the interviewer "Sylvia Palmer" to select.
    fireEvent.click(getByAltText(interviews[0], "Sylvia Palmer"));

    // 4. check the text "Sylvia Palmer" is displayed.
    expect(getByText(interviews[0], "Sylvia Palmer")).toBeInTheDocument();
    
    // 5. click the interviewer "Sylvia Palmer" again to unselect.
    fireEvent.click(getByAltText(interviews[0], "Sylvia Palmer"));

    // 6. check the text "Sylvia Palmer" is unclicked.
    expect(queryByText(interviews[0], "Sylvia Palmer")).toBeNull();

    // 7. click the interviewer "Tori Malcolm" to select.
    fireEvent.click(getByAltText(interviews[1], "Tori Malcolm"));

    // 8. check the text "Tori Malcolm" is displayed.
    expect(getByText(interviews[1], "Tori Malcolm")).toBeInTheDocument();

    // 9. click the interviewer "Sylvia Palmer" to select.
    fireEvent.click(getByAltText(interviews[0], "Sylvia Palmer"));

    // 6. check the text "Tori Malcolm" is unclicked.
    expect(queryByText(interviews[1], "Tori Malcolm")).toBeNull();
  });

  it("enter key disabled", () => {
    // 1. Create the mock onSave function
    const onSave = jest.fn();

    // 2. Render the Form with interviewers, name, and interviewer selected
    const { getByPlaceholderText, queryByText } = render(<Form interviewers={interviewers} student="Lydia Miller-Jones" interviewer={1} />);

    // 3. Press Enter key on the input element
    fireEvent.keyDown(getByPlaceholderText("Enter Student Name"), {key: 'Enter', code: 'Enter', charCode: 13});

    // 4. check that the validation message is not displayed
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(queryByText(/Interviewer must be selected/i)).toBeNull();

    // 5. check that the onSave function is not called
    expect(onSave).not.toHaveBeenCalled();
  });
});