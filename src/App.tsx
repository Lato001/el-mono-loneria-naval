import { Routes, Route } from "react-router-dom";
import { Footer } from "./components/layout";
import { AboutUs, Contact, Faq, Home, Products, Works } from "./pages";
import { PATHS } from "./routes/routes";
import { ScrollToTop } from "./components";
import { Navbar, WhatsappButton } from "./components/ui";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar></Navbar>
      <WhatsappButton></WhatsappButton>
      <Routes>
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.PRODUCTS} element={<Products />} />
        <Route path={PATHS.WORKS} element={<Works />} />
        <Route path={PATHS.ABOUT_US} element={<AboutUs />} />
        <Route path={PATHS.FAQ} element={<Faq />} />
        <Route path={PATHS.CONTACT} element={<Contact />} />
        <Route path={PATHS.NOT_FOUND} element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      <Footer />
    </>
  );
}
