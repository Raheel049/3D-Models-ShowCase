import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Auth/login";
import SignUp from "./Pages/Auth/signUp";
import OtpVerify from "./Pages/Auth/otp";
import OtpReset from "./Pages/Auth/otpReset";
import ChangePassword from "./Pages/Auth/changePassword";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ForgotPassword from './Pages/Auth/forgotPassword'

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/otp" element={<OtpVerify />} />
          <Route path="/otpReset" element={<OtpReset />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="Dashboard" element={<Dashboard />}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
