import { Routes, Route } from "react-router-dom";
import { AboutUs, Contact, Faq, Home, Services } from "./pages";
import { PATHS } from "./routes/routes";
export default function App() {
  return (
    <>
      <Routes>
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.SERVICES} element={<Services />} />
        <Route path={PATHS.ABOUT_US} element={<AboutUs />} />
        <Route path={PATHS.FAQ} element={<Faq />} />
        <Route path={PATHS.CONTACT} element={<Contact />} />

        <Route path={PATHS.NOT_FOUND} element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </>
  );
}
