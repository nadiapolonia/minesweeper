import React, { Component } from 'react'
import axios from 'axios'
import Cell from './Cell'

export class Game extends Component {
  state = {
    board: [],
    difficulty: 0,
    id: 0,
    mines: 0,
    currentState: ''
  }

  // Call upon the new game, will include API responses for the board and corresponding data.
  gameCreate = async () => {
    await axios
      .post('https://minesweeper-api.herokuapp.com/games', { difficulty: 0 })
      .then(resp => {
        this.setState({
          data: resp.data,
          board: resp.data.board,
          mines: resp.data.mines,
          currentState: resp.data.state,
          id: resp.data.id,
          difficulty: resp.data.difficulty
        })
        console.log(resp)
        console.log(resp.data)
      })
  }

  // Create function for left-clicking and checking the mines in the game. Will call upon API that includes the checking logic.

  check = (x, y) => {
    console.log(`clicked ${x}, ${y}`)
    axios
      .post(
        `https://minesweeper-api.herokuapp.com/games/${this.state.id}/check`,
        {
          row: x,
          col: y
        }
      )

      .then(resp => {
        this.setState({
          board: resp.data.board,
          currentState: resp.data.state,
          mines: resp.data.mines
        })
      })
      // Creates a response if the player lands on a mine or successfully flags all present mines aka winning vs losing.
      .then(() => {
        if (this.state.currentState === 'lost') {
          this.setState({
            lost: true
          })
          console.log('You lost!')
        }
        if (this.state.mines === 0) {
          this.setState({
            win: true
          })
          console.log('You win!')
        }
      })
  }

  // Create a flagging function and call the API to respond.
  flag = (x, y) => {
    axios
      .post(
        `https://minesweeper-api.herokuapp.com/games/${this.state.id}/flag`,
        {
          row: x,
          col: y
        }
      )
      .then(resp => {
        this.setState({
          board: resp.data.board,
          mines: resp.data.mines
        })
      })
  }
  componentDidMount = async () => {
    // Axios({
    //   method: 'post',
    //   url: 'http://minesweeper-api.herokuapp.com/games'
    // }).then(res => {
    //   console.log(res)
    //   console.log(res.data)
    // })
    // }

    this.gameCreate()
  }

  render() {
    return (
      // Map out a table using the API response and institute anonymous functions of checking and flagging the individual cells in the game.
      <>
        <main>
          <h1>Let's Play Minesweeper!</h1>
          <p className="status">{this.state.mines} bomb flags left</p>
          <table>
            <tbody>
              {this.state.board.map((col, j) => {
                return (
                  <tr key={j}>
                    {col.map((row, i) => {
                      return (
                        <Cell
                          key={i}
                          display={this.state.board[i][j]}
                          onClick={() => this.check(i, j)}
                          rightClick={() => this.flag(i, j)}
                        />
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </main>
      </>
    )
  }
}

export default Game
