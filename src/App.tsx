import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import DisplayMap from "./components/DisplayMap";
import NewVaccineForm from "./components/NewVaccineForm";
import Header from "./components/Header";
import ManageVaccine from "./components/ManageVaccine";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div>
          <Route exact path="/" component={DisplayMap} />
          <Route exact path="/new-vaccine" component={NewVaccineForm} />
          <Route exact path="/edit-vaccine" component={ManageVaccine} />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
