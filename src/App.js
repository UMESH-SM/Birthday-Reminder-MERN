import "./App.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BirthdayPage from "./components/BirthdayPage";
import AddBirthday from "./components/AddBirthday";
import EditBirthday from "./components/EditBirthday";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/add" component={AddBirthday} />
            <Route path="/edit" component={EditBirthday} />
            <Route exact path="/" component={BirthdayPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
