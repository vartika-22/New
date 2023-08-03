import React, {Component} from "react";
import '../buslist/Buslist.css';
import Table from 'react-bootstrap/Table'
import BusTable from "./Bustable";
import axios from 'axios';
import Navbar from "../route/Navbar";



export default class BusList extends Component{

    constructor(props) {
        super(props)
        this.state = {
          buslist: []
        };
      }
    
      componentDidMount() {
        axios.get('http://localhost:4000/buslist/')
          .then(res => {
            this.setState({
              buslist: res.data
            });
          })
          .catch((error) => {
            console.log(error);
          })
      }
    
      DataTable() {
        return this.state.buslist.map((res, i) => {
          return <BusTable obj={res} key={i} />;
        });
      }

    render(){
        return ( 
        <div className="buslist-bg">
          <Navbar/>
          <div >
            <div className="table-wrapper">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Bus No</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Fare</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.DataTable()}
                    </tbody>
                </Table>
            </div>
        </div>
        </div>
     );
}
}