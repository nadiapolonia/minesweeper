import React, { Component } from 'react'

class Cell extends Component {
  render() {
    return (
      <>
        <td
          className="cell"
          onContextMenu={click => {
            this.props.rightClick()
            click.preventDefault()
          }}
          onClick={this.props.onClick}
        >
          {this.props.display}
        </td>
      </>
    )
  }
}

export default Cell
