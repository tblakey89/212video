import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Lockout from "./Lockout.jsx";

const settings = { startHour: 9, endHour: 19 };

describe("Lockout", () => {
  it("renders the time-up takeover", () => {
    render(<Lockout kind="timeup" settings={settings} />);
    expect(screen.getByText("That's all for today!")).toBeInTheDocument();
    expect(screen.getByText(/see you at 9 am tomorrow/i)).toBeInTheDocument();
  });

  it("renders the too-early takeover with the opening hour", () => {
    render(<Lockout kind="early" settings={settings} />);
    expect(screen.getByText("It's a little early!")).toBeInTheDocument();
    expect(screen.getByText(/opens at 9 am/i)).toBeInTheDocument();
  });

  it("renders the too-late takeover", () => {
    render(<Lockout kind="late" settings={settings} />);
    expect(screen.getByText("Time for bed!")).toBeInTheDocument();
    expect(screen.getByText(/opens at 9 am tomorrow/i)).toBeInTheDocument();
  });

  it("is non-dismissible: no buttons in the kid UI", () => {
    render(<Lockout kind="timeup" settings={settings} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
