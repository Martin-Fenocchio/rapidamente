import { RouterProvider } from "react-router-dom";
import { router } from "./utils/router/router-utils";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
