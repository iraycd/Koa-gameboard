/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React, {Component} from 'react';
import Client from 'boardgame.io/client';
import TicTacToe from './game';
import Board from './board';

const App = Client({
    game: TicTacToe,
    board: Board,
    debug: false,
    multiplayer: true,
});

class Multi extends Component {
    state = {
        playerID: null
    };
    componentDidMount() {
        fetch('/api/test')
            .then(resp => resp.json())
            .then(json => {
                this.setState({playerID: json.playerID})
            });
    }

    render() {
        return (
            <div style={{padding: 50}}>
                <h1>Multiplayer</h1>
                <div className="runner">
                    <div className="run">
                        {this.state.playerID !== null &&
                            <App gameID="multi" playerID={`${this.state.playerID}`} />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Multi;
