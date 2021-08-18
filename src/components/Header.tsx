import { NavLink } from "react-router-dom";
const Header = () => {
  return (
    <div style={{ width: "100%", height: "50px" }}>
      <NavLink exact to="/">
        Map
      </NavLink>
      {" "} | {" "}
      <NavLink exact to="/new-vaccine">
        Add
      </NavLink>
      {" "} | {" "}
      <NavLink exact to="/edit-vaccine">
        Edit 
      </NavLink>
    </div>
  );
};
export default Header;
