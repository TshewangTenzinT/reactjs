import { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Book from "./pages/Book";
import Confirmation from "./pages/Confirmation";
import MyBooking from "./pages/MyBooking";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AGENCY from "./config/agency";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = AGENCY.name;
  }, [pathname]);
  return null;
}

// HashRouter keeps deep links working on static hosts like GitHub Pages.
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tours" element={<Tours />} />
          <Route path="tours/:id" element={<TourDetail />} />
          <Route path="book" element={<Book />} />
          <Route path="confirmation/:reference" element={<Confirmation />} />
          <Route path="my-booking" element={<MyBooking />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
