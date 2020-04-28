import React from "react";
class Grid extends React.Component {
    render() {
      
      return (
         <div className="container">
          <h2>{' '}</h2>
          <table className="grid">
            <tbody>
                { this.props.seat.map( (row,i) =>
                
                  <tr key = {i}>
                      {row.map((col, j) => (
                      <td 
                        
                        className={this.props.reserved.includes(this.props.seat[i][j]) ? 'reserved': 'available'}
                        key={col} onClick = {e => this.onClickSeat(this.props.seat[i][j]) }>
                          <span>{ this.props.seat[i][j] }{' '} </span>
                        </td>
                      )) }
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      )
    }
    
    onClickSeat(seat) {
      this.props.onClickData(seat);
    }

}
export default Grid;  