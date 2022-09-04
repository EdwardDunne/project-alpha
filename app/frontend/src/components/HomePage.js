import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import RoomCreatePage from "./CreateRoomPage";
import HexMenu from "./HexMenu";
import AdminTest from "./AdminTest";
import {
    Routes,
    Route,
} from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Routes>
                <Route exact path="/" element={<HexMenu />}/>
                <Route path="/admin-test" element={<AdminTest />} />
                <Route path="/join" element={<RoomJoinPage />} />
                <Route path="/create" element={<RoomCreatePage />} />
            </Routes>
        );
    }
}