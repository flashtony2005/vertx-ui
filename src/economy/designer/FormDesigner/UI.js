import React from 'react'
import Ux from 'ux';
import Toolbar from './UI.Toolbar';
import Layout from './UI.Layout';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mounted: {}
        }
    }

    render() {
        return (
            Ux.aiGrid([21, 3],
                <Layout pointer={this} target={this.state.mounted}/>,
                <Toolbar pointer={this}/>
            )
        )
    }
}

export default DragDropContext(HTML5Backend)(Component)