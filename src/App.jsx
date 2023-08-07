
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import { Login } from "./pages/login";
import { ErrorPage } from "./pages/404";
import { Employee } from "./pages/employee";

const router = createBrowserRouter([
  { path: "/", element: <Login />, errorElement: <ErrorPage /> },
  { path: "/employee", element: <Employee /> },
]);

function App() {


  return (
    <RouterProvider router={router} />
  )
};

export default App;