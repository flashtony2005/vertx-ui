import React from 'react'
import {v4} from 'uuid';
import {Col, Row, Table} from 'antd';
import {_zero} from "../../_internal";
import Jsx from './UI.Jsx'
import G from './UI.Graphic'

@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI"
})
class Component extends React.PureComponent {
    componentDidMount() {
        const {id = "g6Tree", reference} = this.props;
        const {$hoc} = reference.state;
        const config = $hoc._("configuration");
        if (id && config) {
            G.drawGraphic(id, config);
        }
    }

    render() {
        const {id = "g6Tree", $name} = this.props;
        const {reference} = this.props;
        const current = this.state.$hoc;
        const icon = current._("comment").icon;
        const type = current._("comment").type;
        const table = current._("table");
        const data = reference.state.$hoc._("data");
        data.forEach(item => item.key = v4());
        Jsx.renderColumn(table.columns, current._("mapping"));
        return (
            <div>
                {Jsx.renderCode($name)}
                <Row>
                    <Col span={3}>
                        {Jsx.renderComment(icon, type)}
                    </Col>
                    <Col span={21}>
                        <div id={id}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table pagination={false} {...table} dataSource={data}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component