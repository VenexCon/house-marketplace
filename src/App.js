import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Category from "./pages/Category";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import "react-toastify/dist/ReactToastify.css";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <Router>
        {/* Parent */}
        <Routes>
          {/* Teenager */}
          <Route path="/" element={<Explore />} /> {/* Children */}
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />
          {/* Private Routes are nested inside outer routes. */}
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/contact/:landlordId" element={<Contact />} />
        </Routes>
        <NavBar />
      </Router>
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;
