import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';


export default class EditBus extends Component {

  constructor(props) {
    super(props)

    this.onChangeBusId = this.onChangeBusId.bind(this);
    this.onChangeSource = this.onChangeSource.bind(this);
    this.onChangeDestination = this.onChangeDestination.bind(this);
    this.onChangeFare = this.onChangeFare.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // State
    this.state = {
        BusId: '',
        source: '',
        destination: '',
        fare:''
      }
    }

  componentDidMount() {
    axios.get('http://localhost:4000/buslist/get-buslist/' + this.props.match.params.id)
      .then(res => {
        this.setState({
          BusId: res.data.BusId,
          source: res.data.source,
          destination: res.data.destination,
          fare:res.data.fare
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  onChangeStudentName(e) {
    this.setState({ BusId: e.target.value })
  }

  onChangeStudentEmail(e) {
    this.setState({ source: e.target.value })
  }

  onChangeStudentRollno(e) {
    this.setState({ destination: e.target.value })
  }
  onChangeStudentRollno(e) {
    this.setState({ Fare: e.target.value })
  }


  onSubmit(e) {
    e.preventDefault()

    const busObject = {
        BusId: this.state.BusId,
        source: this.state.source,
        destination: this.state.destination,
        fare:this.state.fare
      };

    axios.put('http://localhost:4000/buslist/update-buslist/' + this.props.match.params.id, busObject)
      .then((res) => {
        console.log(res.data)
        console.log('BusList successfully updated')
      }).catch((error) => {
        console.log(error)
      })

    // Redirect to Student List 
    this.props.history.push('/buslist')
  }


  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="Busid">
          <Form.Label>BusId</Form.Label>
          <Form.Control type="text" value={this.state.BusId} onChange={this.onChangeBusId} />
        </Form.Group>

        <Form.Group controlId="Source">
          <Form.Label>Source</Form.Label>
          <Form.Control type="Text" value={this.state.source} onChange={this.onChangeSource} />
        </Form.Group>

        <Form.Group controlId="Destinaton">
          <Form.Label>Destination</Form.Label>
          <Form.Control type="text" value={this.state.destination} onChange={this.onChangeDestination} />
        </Form.Group>

        <Form.Group controlId="Fare">
          <Form.Label>Fare</Form.Label>
          <Form.Control type="number" value={this.state.fare} onChange={this.onChangeFare} />
        </Form.Group>
        
        <Button variant="danger" size="lg" block="block" type="submit">
          Update Student
        </Button>
      </Form>
    </div>);
  }
}