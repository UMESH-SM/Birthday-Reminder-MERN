import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class EditBirthday extends Component {
  state = {
    name: "",
    dob: "",
    image: "",
    edited: false,
    deleted: false,
    updated: false,
  };

  componentDidMount() {
    axios
      .get(
        "https://mern-birthday-reminder.herokuapp.com/birthdays/" +
          this.props.location.state.id
      )
      .then((res) => {
        this.setState({
          name: res.data.name,
          dob:
            res.data.dob.substring(6) +
            "-" +
            res.data.dob.substring(0, 2) +
            "-" +
            res.data.dob.substring(3, 5),
        });
      })
      .catch((err) => console.log("Error : " + err));
  }

  handleChange = (event) => {
    if (event.target.type === "text") {
      this.setState({
        name: event.target.value,
      });
    } else if (event.target.type === "date") {
      this.setState({
        dob: event.target.value,
      });
    } else {
      this.setState({
        image: event.target.files[0],
      });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();

    let date = this.state.dob;
    let yyyy = date.substring(0, 4);
    let mm = date.substring(5, 7);
    let dd = date.substring(8);
    date = mm + "/" + dd + "/" + yyyy;

    const newbirthday = new FormData();
    newbirthday.append("name", this.state.name.toUpperCase());
    newbirthday.append("dob", date);
    newbirthday.append("image", this.state.image);

    axios
      .post(
        "https://mern-birthday-reminder.herokuapp.com/birthdays/update/" +
          this.props.location.state.id,
        newbirthday
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log("Error3 : " + err));

    this.setState({
      name: "",
      dob: "",
      edited: true,
    });
    setInterval(() => {
      this.setState({ edited: false, updated: true });
    }, 2000);
  };

  handleCancel = () => {
    this.setState({
      name: "",
      dob: "",
      updated: true,
    });
  };

  handleDelete = (id) => {
    axios
      .delete(
        "https://mern-birthday-reminder.herokuapp.com/birthdays/" +
          this.props.location.state.id
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log("Error3 : " + err));

    this.setState({
      name: "",
      dob: "",
      deleted: true,
    });
    setInterval(() => {
      this.setState({ deleted: false, updated: true });
    }, 2000);
  };

  render() {
    if (this.state.updated) {
      return <Redirect exact to="/" />;
    } else {
      return (
        <div className="container2">
          <form onSubmit={this.handleSubmit} className="input-form">
            <label>
              Name <span style={{ color: "tomato" }}>*</span>
            </label>
            <input
              type="text"
              className="name-input"
              value={this.state.name}
              onChange={this.handleChange}
              autoComplete="off"
              required
            />
            <label>
              DOB <span style={{ color: "tomato" }}>*</span>
            </label>
            <input
              type="date"
              className="dob-input"
              onChange={this.handleChange}
              value={this.state.dob}
              required
            />
            <label>Image</label>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              className="image-input"
              ref={this.ref}
              onChange={this.handleChange}
            />
            <button type="submit" className="add-birthday">
              SAVE CHANGES
            </button>
          </form>
          {this.state.edited ? (
            <label style={{ color: "lightgreen", fontSize: "1em" }}>
              Birthday Updated.
            </label>
          ) : null}
          {this.state.deleted ? (
            <label style={{ color: "tomato", fontSize: "1em" }}>
              Birthday Deleted.
            </label>
          ) : null}
          <button onClick={this.handleCancel} className="cancel-birthday">
            Cancel
          </button>
          <button
            className="delete-birthday"
            onClick={() => this.handleDelete(this.props.location.state.id)}
          >
            Delete Birthday
          </button>
        </div>
      );
    }
  }
}

export default EditBirthday;
