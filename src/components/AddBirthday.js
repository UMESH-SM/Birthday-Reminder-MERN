import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class AddBirthday extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef(null);
  }

  state = {
    name: "",
    dob: "",
    image: "",
    added: false,
  };

  abortController = new AbortController();

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
        "https://mern-birthday-reminder.herokuapp.com/birthdays/add",
        newbirthday
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log("Error : " + err));

    this.setState({
      name: "",
      dob: "",
      image: "",
      added: true,
    });

    setInterval(() => {
      this.setState({ added: false });
    }, 2000);

    this.ref.current.value = "";
  };

  render() {
    return (
      <div className="container2">
        <form
          onSubmit={this.handleSubmit}
          encType="multipart/form-data"
          className="input-form"
        >
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
            ADD
          </button>
        </form>
        {this.state.added ? (
          <label style={{ color: "lightgreen", fontSize: "1em" }}>
            Birthday Added.
          </label>
        ) : null}
        <Link to={{ pathname: "/" }} className="link-btn">
          Home Page
        </Link>
      </div>
    );
  }
}

export default AddBirthday;
