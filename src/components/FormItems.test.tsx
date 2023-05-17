import {
  render,
  queryByAttribute,
  screen,
  fireEvent,
} from "@testing-library/react";

import "@testing-library/jest-dom/extend-expect";

import FormItems from "./FormItems";

const getById = queryByAttribute.bind(null, "id");

describe("FormItems", () => {
  it("FormItems should render without crashing", () => {
    const items = [
      {
        id: 1,
        name: "Milk",
        quantity: 1,
        isChecked: false,
      },
    ];
    const isLightMode = true;
    const handleAddItem = jest.fn();
    const dom = render(
      <FormItems
        handleAddItem={handleAddItem}
        items={items}
        isLightMode={isLightMode}
      />
    );

    const form = getById(dom.container, "form");

    expect(form).toBeInTheDocument();
    if (!form) return;

    const namInput = form.querySelector('input[id="name"]');
    expect(namInput).toBeInTheDocument();
    if (!namInput) return;

    fireEvent.change(namInput, { target: { value: "Milk" } });

    const quantityInput = form.querySelector('input[id="quantity"]');
    expect(quantityInput).toBeInTheDocument();
    if (!quantityInput) return;

    fireEvent.change(quantityInput, { target: { value: 3 } });

    const submitBtn = screen.getByRole("button");
    expect(quantityInput).toBeInTheDocument();
    if (!submitBtn) return;

    fireEvent.click(submitBtn);

    expect(handleAddItem).toBeCalledWith("Milk", 3);

    // expect(handleAddItem).not.toBeCalled();
  });
});
