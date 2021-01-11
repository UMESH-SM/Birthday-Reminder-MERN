import React, { Component } from "react";
import BirthdayCard from "./BithdayCard";
import axios from "axios";
import { Redirect } from "react-router-dom";

class BirthdayPage extends Component {
  state = {
    sort: "Upcoming",
    birthdays: [],
    displayBirthdays: [],
    isAuthorized: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    axios
      .get("https://mern-birthday-reminder.herokuapp.com/birthdays/")
      .then((res) => {
        this.setState({
          birthdays: res.data,
        });
      })
      .catch((err) => console.log("Error : " + err))
      .then(this.handleSort);
  };

  handleSort = () => {
    let days = [];
    let age = [];
    this.state.birthdays.forEach((bday, pos) => {
      let today = new Date();
      let cur_year_bday = new Date(bday.dob);

      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0");
      let cur_year = today.getFullYear();
      let next_year = cur_year + 1;

      today = new Date(mm + "/" + dd + "/" + cur_year);

      dd = String(cur_year_bday.getDate()).padStart(2, "0");
      mm = String(cur_year_bday.getMonth() + 1).padStart(2, "0");
      const original_year = cur_year_bday.getFullYear();

      cur_year_bday = new Date(mm + "/" + dd + "/" + cur_year);
      let next_year_bday = new Date(mm + "/" + dd + "/" + next_year);

      const original_bday = new Date(mm + "/" + dd + "/" + original_year);

      const diffTime =
        cur_year_bday - today >= 0
          ? cur_year_bday - today
          : next_year_bday - today;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      days[pos] = diffDays;

      const diff = today - original_bday;
      const diffYears = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

      age[pos] = diffYears;
    });

    this.setState({
      birthdays: this.state.birthdays.map((bday, pos) => {
        return { ...bday, days: days[pos], age: age[pos] };
      }),
    });

    let SortedArray = this.state.birthdays;
    SortedArray.sort(function (a, b) {
      return a.days - b.days;
    });

    this.setState({
      birthdays: SortedArray,
      displayBirthdays: SortedArray,
    });
  };

  handleSearch = (event) => {
    if (event.target.value.length) {
      this.setState({
        displayBirthdays: this.state.birthdays.filter(
          (bday) => bday.name.indexOf(event.target.value.toUpperCase()) >= 0
        ),
      });
    } else {
      this.setState({
        displayBirthdays: this.state.birthdays,
      });
    }
  };

  handleChange = (event) => {
    if (event.target.value === "Upcoming") {
      let SortedArray = this.state.birthdays;
      SortedArray.sort(function (a, b) {
        return a.days - b.days;
      });

      this.setState({
        sort: "Upcoming",
        birthdays: SortedArray,
        displayBirthdays: SortedArray,
      });
    } else {
      let reverseSortedArray = this.state.birthdays;
      reverseSortedArray.sort(function (a, b) {
        return b.days - a.days;
      });

      this.setState({
        sort: "Earlier",
        birthdays: reverseSortedArray,
        displayBirthdays: reverseSortedArray,
      });
    }
  };

  handleAddBirthday = () => {
    var pass = prompt("Enter the Password");
    if (pass === "bdr1205") {
      this.setState({ isAuthorized: true });
    }
  };

  render() {
    if (this.state.isAuthorized) {
      return <Redirect exact to="/add" />;
    } else {
      return (
        <div className="container">
          <div className="search-sort-card">
            <div className="search-box">
              <input
                type="text"
                className="search-txt"
                autoComplete="off"
                placeholder="Type to search"
                onChange={this.handleSearch}
              />
              <div className="search-btn">
                <img src="search-icon.png" alt="" className="search-icon" />
              </div>
            </div>
            <select onChange={this.handleChange} className="select-opt">
              <option>Upcoming</option>
              <option>Earlier</option>
            </select>
          </div>
          <div className="outer-card">
            {this.state.displayBirthdays.map((bday) => {
              return (
                <BirthdayCard
                  key={bday._id}
                  bday={bday}
                  sort={this.state.sort}
                  fetchData={this.fetchData}
                />
              );
            })}
          </div>
          <button onClick={this.handleAddBirthday} className="add-birthday">
            Add Birthday
          </button>
        </div>
      );
    }
  }
}

export default BirthdayPage;
