import React from 'react'
import Ux from "ux";
import {Fn} from 'app';
import {HelpCard} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Fn.demoMarkdown(this, require("./UI.Desc.md"))
    }

    render() {
        const demo = Ux.fromHoc(this, "demo");
        const {source = ""} = this.state ? this.state : {};
        return Fn.demoComponent(this,
            <HelpCard reference={this}>
                {Fn.demoMessage(this)}
                {Fn.demoButtons(this, demo.buttons)}
            </HelpCard>
            , source)
    }
}

export default Component