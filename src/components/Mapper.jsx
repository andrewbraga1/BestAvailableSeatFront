import React from "react";
class Mapper extends React.Component {
 
 
  render() {
    return (
    	<div className="row">
        <div>
          <h2>Seats</h2>
          <div className="value">{this.props.number_of_seats}</div>
          <button id="add_seat_value" onClick={e => this.buttonClicked(e)}>Add</button>
          <button id="remove_seat_value" onClick={e => this.buttonClicked(e)}>Remove</button>
        </div>
        <div>
          <h2>Rows</h2>
          <div className="value">{this.props.rows}</div>
          <button id="add_row" onClick={e => this.buttonClicked(e)}>Add</button>
          <button id="remove_row" onClick={e => this.buttonClicked(e)}>Remove</button>
        </div>
        <div>
          <h2>Columns</h2>  
          <div className="value">{this.props.columns}</div>
          <button id="add_column" onClick={e => this.buttonClicked(e)}>Add</button>
          <button id="remove_column" onClick={e => this.buttonClicked(e)}>Remove</button>
        </div>
      </div>
      
    );
  }
   
  buttonClicked(seat) {
    this.props.buttonClicked(seat);
  }
}
export default Mapper;  