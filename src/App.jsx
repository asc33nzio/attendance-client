import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./pages/login";
import { Employee } from "./pages/employee";
import { Profile } from "./pages/profile";
import { EmployeeList } from "./pages/employeeList";
import { Register } from "./pages/register";
import { Forgot } from "./pages/forgot";
import { Reset } from "./pages/reset";
import { AttendanceHistory } from "./pages/attendanceHistory";
import { Payroll } from "./pages/payroll";
import { Error400 } from "./pages/400";
import { Error404 } from "./pages/404";

const router = createBrowserRouter([
  { path: "/", element: <Login />, errorElement: <Error404 /> },
  { path: "/employee", element: <Employee /> },
  { path: "/profile", element: <Profile /> },
  { path: "/employeelist", element: <EmployeeList /> },
  { path: "/register/:token", element: <Register />, errorElement: <Error400 /> },
  { path: "/400", element: <Error400 /> },
  { path: "/forgetpassword", element: <Forgot /> },
  { path: "/resetpassword/:token", element: <Reset /> },
  { path: "/history", element: <AttendanceHistory /> },
  { path: "/payroll", element: <Payroll /> },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
};

export default App;