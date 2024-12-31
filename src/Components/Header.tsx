import "beercss";
import "material-dynamic-colors";
import LogoLink from "./LogoLink";
import OptionsDropdown from "./OptionsDropdown";
import SearchInput from "./SearchInput";

function Header() {
  return (
    <header className="transparent">
      <nav>
        <LogoLink />
        <SearchInput />
        <OptionsDropdown />
      </nav>
    </header>
  );
}

export default Header;
