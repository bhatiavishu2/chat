import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { getRooms, createRoom } from '../util/api'
import Room from '../components/CreateRoom';
;
const initialState = {
    name: '',
    room: '',
    roomOptions: [],
}

class Join extends Component {

    constructor() {
        super();
        this.state = {
            ...initialState
        }
    }

    componentDidMount() {
       this.fetchRoom();
    }

    fetchRoom = async () => {
        const roomData = await getRooms();
        this.setState({roomOptions: roomData.data });
    }

    clearForm() {
        this.setState({
            ...initialState
        });
    }

    createNewRoom = (data) => {
        this.setState({roomOptions: [...this.state.roomOptions, data]});
        createRoom(data);
    }

    inputUpdate(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        });
    }

    join() {
        const { name, room } = this.state;
        if (name && room) {
            this.props.history.push(`/chat/${name}/${room}`)
        }
    }

    render() {

        const { name, roomOptions } = this.state;

        return (
            <div className="joinForm">

                <div className="form_wrap">
                    <div className="form_row">
                        <div className="form_item">
                            <div className="form_input">
                                <input type="text" placeholder="Full Name" autoComplete="off" name="name" value={name} onChange={this.inputUpdate.bind(this)} />
                                <span className="bottom_border"></span>
                            </div>
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="form_item">
                            <div className="form_select">
                                <select name="room" onChange={this.inputUpdate.bind(this)}>
                                    <option>Please select room first</option>
                                    {
                                        roomOptions.map((room, indx) => <option key={indx} value={room.roomTitle}>{room.roomTitle}</option>)
                                    }
                                </select>
                                <i className="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                    <div className="form_buttons">
                        <button onClick={() => this.join()} className="btn">
                            Join
                        </button>
                        <Room onSubmit={this.createNewRoom}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Join);