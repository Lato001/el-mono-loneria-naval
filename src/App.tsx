import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Footer, Header } from "./components/layout";
import { AboutUs, Contact, Faq, Home, Products, Works } from "./pages";
import { PATHS } from "./routes/routes";
import { ScrollToTop } from "./components";

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <ScrollToTop />
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-sc-ocean-blue/90" : ""
        }`}
      >
        <Header />
      </div>
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
