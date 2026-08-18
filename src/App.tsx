import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Footer } from "./components/layout";
import { Home } from "./pages/Home";
import { AboutUs } from "./pages/AboutUs";
import { PATHS } from "./routes/routes";
import { ScrollToTop } from "./components";
import { Navbar, WhatsappButton, NextPageCta } from "./components/ui";

const Works = lazy(() =>
  import("./pages/Works").then((m) => ({ default: m.Works })),
);
const Products = lazy(() =>
  import("./pages/Products").then((m) => ({ default: m.Products })),
);
const Contact = lazy(() =>
  import("./pages/Contact").then((m) => ({ default: m.Contact })),
);
const Faq = lazy(() => import("./pages/Faq").then((m) => ({ default: m.Faq })));

export default function App() {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <Navbar></Navbar>
      {location.pathname !== PATHS.PRODUCTS && (
        <WhatsappButton></WhatsappButton>
      )}
      <Suspense
        fallback={
          <div
            className="flex min-h-[50vh] items-center justify-center"
            role="status"
            aria-busy="true"
          >
            Cargando…
          </div>
        }
      >
        <Routes>
          <Route path={PATHS.HOME} element={<Home />} />
          <Route path={PATHS.PRODUCTS} element={<Products />} />
          <Route path={PATHS.WORKS} element={<Works />} />
          <Route path={PATHS.ABOUT_US} element={<AboutUs />} />
          <Route path={PATHS.FAQ} element={<Faq />} />
          <Route path={PATHS.CONTACT} element={<Contact />} />
          <Route path={PATHS.NOT_FOUND} element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Suspense>
      <NextPageCta />
      <Footer />
    </>
  );
}
