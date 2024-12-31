import "beercss";
import "material-dynamic-colors";
import HeaderLogoLink from "./HeaderLogoLink";
import HeaderMoreButton from "./HeaderMoreButton";
import SearchInput from "./SearchInput";

function Header() {
  return (
    <header className="transparent">
      <nav>
        <HeaderLogoLink />
        <SearchInput />
        <HeaderMoreButton />
      </nav>
    </header>
  );
}

export default Header;
