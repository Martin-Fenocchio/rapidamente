import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import OnboardingScreen from "./onboarding-screen";
import { useOnboardingLogic } from "../hooks/onboarding-hook";

vi.mock("../hooks/onboarding-hook");
vi.mock("src/components/background/hyperspeedBackground", () => ({ default: () => null }));
vi.mock("src/components/podium/Podium", () => ({ default: () => null }));
vi.mock("../components/modal-ask-name", () => ({ default: () => null }));
vi.mock("../components/have-played-blocker", () => ({ default: () => <p>Ya has jugado hoy!</p> }));

describe("Onboarding screen", () => {
  it("blocks another attempt after playing today", () => {
    vi.mocked(useOnboardingLogic).mockReturnValue({ havePlayedToday: true } as ReturnType<typeof useOnboardingLogic>);
    render(<OnboardingScreen onSaveName={async () => {}} />);
    expect(screen.getByText(/Ya has jugado hoy/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Comenzar" })).not.toBeInTheDocument();
  });
  it("offers play when there is no attempt today", () => {
    vi.mocked(useOnboardingLogic).mockReturnValue({ havePlayedToday: false } as ReturnType<typeof useOnboardingLogic>);
    render(<OnboardingScreen onSaveName={async () => {}} />);
    expect(screen.getByRole("button", { name: "Comenzar" })).toBeInTheDocument();
  });
});
