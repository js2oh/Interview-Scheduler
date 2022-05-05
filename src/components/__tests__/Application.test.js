import React from "react";

import { render, findByText, waitForElement, fireEvent } from "@testing-library/react";

import Application from "components/Application";

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  
  const { getByText, findByText } = render(<Application />);

  // return waitForElement(() => getByText("Monday"));
  await findByText("Monday").then(() => {
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

});
