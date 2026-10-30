import { PlusCircle } from "lucide-react";
import "./Header.css";

function Header({ title, subtitle, onCreate }) {
  return (
    <header className="header">
      <div>
        <h2 className="header__title">{title}</h2>
        <p className="header__subtitle">{subtitle}</p>
      </div>

      <button className="btn-primary" onClick={onCreate}>
        <PlusCircle size={16} />
        New Incident
      </button>
    </header>
  );
}

export default Header;
