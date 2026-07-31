import { Routes, Route } from "react-router-dom";
import { Footer, Header } from "./components/layout";
import { AboutUs, Contact, Faq, Home, Products, Works } from "./pages";
import { PATHS } from "./routes/routes";
import { ScrollToTop } from "./components";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
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
