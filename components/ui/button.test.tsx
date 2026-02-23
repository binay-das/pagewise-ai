import { render, screen } from "@testing-library/react";
import { Button } from "./button";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("Button component", () => {
    it("renders correctly with children", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("handles click events", async () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole("button", { name: /click me/i });
        await userEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("is disabled when the disabled prop is passed", () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole("button", { name: /disabled/i });
        expect(button).toBeDisabled();
    });

    it("applies variant classes correctly", () => {
        const { rerender } = render(<Button variant="destructive">Destructive</Button>);
        let button = screen.getByRole("button", { name: /destructive/i });
        expect(button).toHaveClass("bg-destructive");

        rerender(<Button variant="outline">Outline</Button>);
        button = screen.getByRole("button", { name: /outline/i });
        expect(button).toHaveClass("border");
    });

    it("renders as a different component when asChild is true", () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        const link = screen.getByRole("link", { name: /link button/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/test");
        expect(link).toHaveClass("inline-flex");
    });
});
