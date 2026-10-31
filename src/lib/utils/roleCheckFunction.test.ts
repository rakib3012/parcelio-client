import { describe, it, expect } from "vitest";
import { getRoleDestination } from "./roleCheckFunction";

describe("Role Destination Redirection", () => {
  it("redirects admin to /admin", () => {
    expect(getRoleDestination("admin")).toBe("/admin");
  });

  it("redirects operator to /operator", () => {
    expect(getRoleDestination("operator")).toBe("/operator");
  });

  it("redirects rider to /rider", () => {
    expect(getRoleDestination("rider")).toBe("/rider");
  });

  it("defaults to /user_dashboard for normal user or undefined", () => {
    expect(getRoleDestination("user")).toBe("/user_dashboard");
    expect(getRoleDestination(undefined)).toBe("/user_dashboard");
  });
});