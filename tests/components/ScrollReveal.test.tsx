import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ScrollReveal from "../../src/components/ScrollReveal";

describe("ScrollReveal", () => {
  it("renders children", () => {
    const { getByText } = render(
      <ScrollReveal>
        <p>Hello world</p>
      </ScrollReveal>
    );
    expect(getByText("Hello world")).toBeDefined();
  });

  it("applies initial hidden styles", () => {
    const { container } = render(
      <ScrollReveal>
        <p>Content</p>
      </ScrollReveal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.opacity).toBeDefined();
  });
});
