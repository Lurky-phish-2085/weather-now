import "beercss";
import "material-dynamic-colors";
import HeaderMoreButton from "./HeaderMoreButton";
import HeaderLogoLink from "./LogoLink";

function Header() {
  return (
    <>
      <header className="transparent">
        <nav>
          <HeaderLogoLink />
          <HeaderMoreButton />
        </nav>
      </header>
    </>
  );
}

export default Header;
