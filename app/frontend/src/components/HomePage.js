import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import RoomCreatePage from "./CreateRoomPage";
import HexMenu from "./HexMenu";
import { 
    BrowserRouter as Router, 
    Switch, 
    Route, 
    Link, 
    Redirect 
} from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={HexMenu} />
                    <Route path="/join" component={RoomJoinPage} />
                    <Route path="/create" component={RoomCreatePage} />
                </Switch>
            </Router>
        );
    }
}