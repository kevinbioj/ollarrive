import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "~/App";
import "~/setup-dayjs";

const container = document.getElementById("root");
if (container == null) throw new Error("No root container was found, aborting");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);

declare global {
  interface ReadonlyArray<T> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(
      searchElement: unknown,
      fromIndex?: number
    ): searchElement is ReadonlyArray<T>[number];
  }
}
