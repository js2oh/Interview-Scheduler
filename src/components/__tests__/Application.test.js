import React from "react";
import axios from "axios";

import { render, fireEvent, findByText, findByAltText, getAllByTestId, getByAltText, getByPlaceholderText, getByText, queryByText } from "@testing-library/react";

import Application from "components/Application";

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText, findByText } = render(<Application />);
    
    // deprecated option # 1: waitForElement()
    // return waitForElement(() => getByText("Monday"));

    // promise chain option # 2: await findByText().then()
    // await findByText("Monday").then(() => {
    //   fireEvent.click(getByText("Tuesday"));
    //   expect(getByText("Leopold Silvers")).toBeInTheDocument();
    // });

    // async/await option # 3
    await findByText("Monday");
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it ("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Click the "Add" button on the first empty appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await findByText(appointment, "Lydia Miller-Jones");
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();

    // 10. Clean up the side-effect
    fireEvent.click(getByAltText(appointment, "Delete"));
    fireEvent.click(getByText(appointment, "Confirm"));
    await findByAltText(appointment, "Add");
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Click the "Delete" button on the second appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is displayed.
    expect(getByText(appointment, /Are you sure you would like to delete?/i)).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation element.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed on the deleted appointment.
    await findByAltText(appointment, "Add");

    // 8. Check that the element with the text "Archie Cohen" is not displayed.
    expect(queryByText(container, "Archie Cohen")).toBeNull();

    // 9. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();

    // 10. Clean up the side-effect
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Archie Cohen" }
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    fireEvent.click(getByText(appointment, "Save"));
    await findByText(appointment, "Archie Cohen");
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Click the "Edit" button on the second appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await findByText(appointment, "Lydia Miller-Jones");
    expect(queryByText(appointment, "Archie Cohen")).toBeNull();

    // 9. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    // 1. Use mockRejectedValueOnce() to fake an error with mock axios
    axios.put.mockRejectedValueOnce("Saving Error");
    
    // 2. Render the Application.
    const { container } = render(<Application />);

    // 3. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 4. Click the "Add" button on the first empty appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    // 5. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 6. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 7. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 8. Wait until the saving error message is displayed.
    await findByText(appointment, /Could not save the appointment/i);
    
    // 9. Click the "Close" button on the error message.
    fireEvent.click(getByAltText(appointment, "Close"));

    // 10. Check that the mode returned back to the previous form.
    expect(getByPlaceholderText(appointment, /Enter Student Name/i)).toBeInTheDocument();

    // 11. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    // 1. Use mockRejectedValueOnce() to fake an error with mock axios
    axios.delete.mockRejectedValueOnce("Deleting Error");
    
    // 2. Render the Application.
    const { container, debug } = render(<Application />);

    // 3. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 4. Click the "Delete" button on the second appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 5. Check that the confirmation message is displayed.
    expect(getByText(appointment, /Are you sure you would like to delete?/i)).toBeInTheDocument();

    // 6. Click the "Confirm" button on the confirmation element.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 8. Wait until the deleting error message is displayed.
    await findByText(appointment, /Could not cancel the appointment/i);
    
    // 9. Click the "Close" button on the error message.
    fireEvent.click(getByAltText(appointment, "Close"));

    // 10. Check that the mode returned back to the previous form.
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();

    // 11. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });
});