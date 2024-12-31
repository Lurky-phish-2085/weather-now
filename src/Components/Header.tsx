import "beercss";
import "material-dynamic-colors";
import HeaderLogoLink from "./HeaderLogoLink";
import OptionsDropdown from "./OptionsDropdown";
import SearchInput from "./SearchInput";

function Header() {
  return (
    <header className="transparent">
      <nav>
        <HeaderLogoLink />
        <SearchInput />
        <OptionsDropdown />
      </nav>
    </header>
  );
}

export default Header;
