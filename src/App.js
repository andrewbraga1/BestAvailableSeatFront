import React from "react";

import './App.scss';
import Grid from './components/Grid';
import Mapper from "./components/Mapper";
import api from './services/Api';


class App extends React.Component {
  constructor() {
    
    super();
      this.state = {
      rows:14,
      columns:12 , 
      suggestion:[],
      seatAvailable: [],
      seatReserved: [],
      number_of_seats:1,
      seat_matrix_array:[]
    }
   
  }

  buildMapSeats(rows,columns){
    var matrix = [[]];
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    for(var i=0; i<rows; i++) {
      matrix[i] = [];
      for(var j=0; j<columns; j++) {
          matrix[i][j] = alphabet[i]+(j+1);
      }
    }
    //debugger
    return matrix
  }

  getArrayOfMatrix(seat_matrix){
    var seat_matrix_array = []
    seat_matrix.forEach(element =>{
      element.forEach(element1 =>{
        
          seat_matrix_array.push(element1)
      })
    })
    return seat_matrix_array
  }

  
  componentWillMount(){
    var seat_matrix =  this.buildMapSeats(this.state.rows,this.state.columns) 
    var seat_matrix_array =  this.getArrayOfMatrix(seat_matrix)
    
    let reserved_array =  seat_matrix_array.filter(res => !this.state.seatAvailable.includes(res))
    //debugger
    this.setState({...this.state,seat: seat_matrix,seatReserved:reserved_array,seat_matrix_array:seat_matrix_array})
  }

   

  async removeElement(arr,element){
    let index = arr.indexOf(element)
    await arr.splice(index,1)
    return arr
  }

  async onClickData(seat) {
    
    if(this.state.seatReserved.includes(seat)) {
      var seatReserved_update = await this.removeElement(this.state.seatReserved,seat)
      var newSeatAvailable = this.state.seatAvailable
      newSeatAvailable.push(seat)
      this.setState({
        seatAvailable: newSeatAvailable,
        seatReserved: seatReserved_update
      })
      
    } 
    
    else {
      if(this.state.seatAvailable.includes(seat)){
        var seatAvailable_update = await this.removeElement(this.state.seatAvailable,seat)
        var newSeatReserved = this.state.seatReserved
        newSeatReserved.push(seat)
        this.setState({
          seatReserved: newSeatReserved,
          seatAvailable: seatAvailable_update
        })
      }
      
    }
  }

   async mapSeat(){
    var seat_matrix =  this.buildMapSeats(this.state.rows,this.state.columns) 
    var seat_matrix_array =  this.getArrayOfMatrix(seat_matrix)
    
    let reserved_array =  seat_matrix_array.filter(res => !this.state.seatAvailable.includes(res))
    //debugger
    await this.setState({...this.state,seat: seat_matrix,seatReserved:reserved_array,seat_matrix_array:seat_matrix_array})
  }


  async buttonClicked(event) {
    if ((event.target.id).includes('add_row')){
      let rows = this.state.rows + 1
      await this.setState({...this.state,rows:rows})
    } 
    else if ((event.target.id).includes('remove_row')){
      let rows = this.state.rows >1 ? this.state.rows - 1 : this.state.rows
      await this.setState({...this.state,rows:rows})
    }
    else if ((event.target.id).includes('add_column')){
      let columns = this.state.columns + 1
      await this.setState({...this.state,columns:columns})
    }
    else if ((event.target.id).includes('remove_column')){
      let columns = this.state.columns >1 ?  this.state.columns - 1 : this.state.columns
      await this.setState({...this.state,columns:columns})
    }
    else if ((event.target.id).includes('add_seat_value')){
      let number_of_seats = this.state.number_of_seats < this.state.seat_matrix_array.length ?  this.state.number_of_seats + 1 : this.state.number_of_seats
      await this.setState({...this.state,number_of_seats:number_of_seats})
    }else if ((event.target.id).includes('remove_seat_value')){
      let number_of_seats = this.state.number_of_seats > 1 ?  this.state.number_of_seats - 1 : this.state.number_of_seats
      await this.setState({...this.state,number_of_seats:number_of_seats})
    }
      await this.mapSeat()
   
  }

  getSuggestion(){
    var obj = {
      "venue":{
        "layout":{
          "rows":this.state.rows,
          "columns":this.state.columns
        }
      },
      "number_of_seats": this.state.number_of_seats
    }
    var seats = Object.create({seats:{}})
    this.state.seatAvailable.forEach(element=>{
      let value = {}
       value[element]= {
          "id": element,
          "row": element[0],
          "columns":parseInt(element.substring(1,element.length)),
          "status":"AVAILABLE"
        }
      let aux = seats['seats']
      seats['seats'] = Object.assign(aux,value)
      
    }) 
    obj = Object.assign(obj,seats)
    
    api.post('api/v1/track_best_seats',obj)
    .then(res => {
      console.log(res);
      console.log(res.data);
      this.setState({...this.state,suggestion: res.data.suggestion})
    })
  }
  
  render() {
    
    return (
      <div>
          <h1>Best Seat Reservation Advisor</h1>
            <div className="row" >
              <div>
                <div className="row align"><div className="square square_available"></div><h4 >AVAILABLE</h4></div>
              </div>
              <div >
                <div className="row align"><div className="square square_reserved"></div><h4 >RESERVED</h4></div>
              </div>
              <div className="counter">
                <Mapper
                  number_of_seats = { this.state.number_of_seats}
                  rows = { this.state.rows }
                  columns = { this.state.columns }
                  buttonClicked = { this.buttonClicked.bind(this) }/>
              </div>
             
              <div>
                  <div className="align">
                    <h3 >Suggestion</h3>{' '}
                    {this.state.suggestion.map( (item_suggestion,i)=>(
                    <div key={i} className="suggestion">{item_suggestion}</div>
                    ))}
                  </div>
                </div>
                  <div className="row align">
                    
                    <button id="remove_row" onClick={() => this.getSuggestion()}>Get Suggestion</button>
                  </div>
              </div>
            <div className="row">
              <Grid 
                seat = { this.state.seat }
                available = { this.state.seatAvailable }
                reserved = { this.state.seatReserved }
                onClickData = { this.onClickData.bind(this) }
                />
            
            </div>
      </div>
    )
  }
}

export default App;
