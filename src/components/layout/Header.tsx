import logoSrc from "../../assets/img/logo/isotipo-elmono-01.png";

export function Header() {
  return (
    <header className="bg-sc-ocean-blue">
      <div className="mx-auto flex w-full items-center justify-center px-6 py-3">
        <img src={logoSrc} alt="Logo" className="h-auto w-32 md:w-40" />
      </div>
    </header>
  );
}
