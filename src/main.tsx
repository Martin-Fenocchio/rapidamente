import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "src/assets/style/global.scss";

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://818d2d04a4f50aaeb047f0285e980654@o4506784910016512.ingest.us.sentry.io/4509172024344576",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
