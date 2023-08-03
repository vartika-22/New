import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

export default class BusTable extends Component {
  constructor(props) {
    super(props)
    this.deleteBus= this.deleteBus.bind(this)
  }

  deleteBus() {
    axios
      .delete(
        'http://localhost:4000/buslist/delete-bus/' + this.props.obj._id,
      )
      .then((res) => {
        console.log('bus successfully deleted!')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return (
      <tr>
        <td>{this.props.obj.BusId}</td>
        <td>{this.props.obj.source}</td>
        <td>{this.props.obj.destination}</td>
        <td>{this.props.obj.fare}</td>
        <td>
          <Link
            className="edit-link" path={"product/:id"}
            to={'/edit-buslist/' + this.props.obj._id}
          >
            Edit
          </Link>
          <Button onClick={this.deleteBus} size="sm" variant="danger">
            Delete
          </Button>
        </td>
      </tr>
    )
  }
}
