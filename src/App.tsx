import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Header, Navbar } from "./components/layout";
import { AboutUs, Contact, Faq, Home, Services } from "./pages";
import { PATHS } from "./routes/routes";

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
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-sc-ocean-blue/90 backdrop-blur-sm" : ""
        }`}
      >
        <Header />
        <Navbar />
      </div>
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
