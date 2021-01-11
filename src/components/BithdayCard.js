import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class BirthdayCard extends Component {
  state = {
    isAuthorized: false,
  };

  componentDidMount() {
    this.props.fetchData();
  }

  handleEditBirthday = () => {
    var pass = prompt("Enter the Password");
    if (pass === "bdr1205") {
      this.setState({ isAuthorized: true });
    }
  };

  render() {
    if (this.state.isAuthorized) {
      return (
        <Redirect
          to={{ pathname: "/edit", state: { id: this.props.bday._id } }}
        />
      );
    } else {
      const options = { month: "short", day: "numeric" };
      let dob = new Date(this.props.bday.dob);
      dob = dob.toLocaleDateString("en-US", options);

      const url =
        this.props.bday.image !== null
          ? `https://mern-birthday-reminder.herokuapp.com/images/${this.props.bday.image}`
          : "empty-pic.png";

      return (
        <div className="inner-card">
          <div className="row-1">
            <img src={url} alt="" className="image" />
          </div>
          <div className="row-2">
            <div className="name">{this.props.bday.name}</div>
            <div className="dob-age">
              <div className="dob">{dob}</div>
              <div className="age">{this.props.bday.age}</div>
            </div>
            <div className="daystogo">
              {this.props.sort === "Upcoming"
                ? this.props.bday.days === 0
                  ? `Today is ${this.props.bday.name}'s Birthday!`
                  : `${this.props.bday.days} days to go`
                : this.props.bday.days === 0
                ? `Today is ${this.props.bday.name}'s Birthday!`
                : `${365 - this.props.bday.days} days ago`}
            </div>
            <div onClick={this.handleEditBirthday} className="edit">
              <img src="edit.png" alt="" className="edit-icon" />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default BirthdayCard;
