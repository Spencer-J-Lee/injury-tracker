import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { config } from "@fortawesome/fontawesome-svg-core";
import App from "./App.tsx";
import { requestPersistentStorage } from "@/db/backup";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "./index.css";
config.autoAddCss = false;

requestPersistentStorage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
