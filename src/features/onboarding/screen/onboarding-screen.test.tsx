import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, Mock, vi } from "vitest";
import OnboardingScreen from "./onboarding-screen";
import { useOnboardingLogic } from "../hooks/onboarding-hook";

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

const defaultHookValues = {
  showAnimation: false,
  historicalRecord: 0,
  havePlayedToday: false,
  handleStartGame: vi.fn(),
};

vi.mock("../hooks/onboarding-hook.ts");

describe("Onboarding Screen", () => {
  const renderPage = () => {
    render(
      <MemoryRouter>
        <OnboardingScreen onSaveName={() => {}} />
      </MemoryRouter>
    );
  };

  it("Dailly blocker is showed", () => {
    (useOnboardingLogic as Mock).mockReturnValue({});

    (useOnboardingLogic as Mock).mockImplementation(() => ({
      ...defaultHookValues,
      havePlayedToday: true,
    }));

    renderPage();

    const daillyBlockerUI = screen.getByText(/Ya has jugado hoy!/);

    expect(daillyBlockerUI).toBeInTheDocument();
  });

  it("Historical record is showed", () => {
    (useOnboardingLogic as Mock).mockReturnValue({});

    (useOnboardingLogic as Mock).mockImplementation(() => ({
      ...defaultHookValues,
      historicalRecord: 10,
    }));

    renderPage();

    expect(screen.getByText(/Tu récord: 10 puntos/)).toBeInTheDocument();
  });
});
