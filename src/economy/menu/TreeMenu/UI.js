import React from 'react'
import {DataLabor} from 'entity';
import {Icon, Tree} from 'antd';
import Immutable from 'immutable';

const TreeNode = Tree.TreeNode;
const renderNode = (item = {}) => {
    return (
        <TreeNode title={item.label} key={item.key} icon={
            <Icon type={"folder-open"}/>
        }>
            {item.children ? (item.children.map(child => renderNode(child))) : false}
        </TreeNode>
    )
};

class Component extends React.PureComponent {
    render() {
        const {$config = {}, $data = [], $hitted = [], jsx = {}} = this.props;
        const {fnSelect, fnCheck} = this.props;
        const {
            label = "label", id = "key",
            pid = "parentId",
            sort = "left", level = "level"
        } = $config;
        const treeConfig = {
            label, id, pid, value: id, sort, level
        };
        const dataKey = Immutable.fromJS($data.filter(item => !!item[pid]).map(item => item[id]));
        const treeData = DataLabor.getTree($data, treeConfig);
        const attrs = {};
        if (fnSelect) attrs.onSelect = fnSelect;
        if (fnCheck) {
            attrs.onCheck = fnCheck;
            attrs.checkable = true;
        }
        attrs.defaultExpandAll = true;
        attrs.style = {width: "90%"};
        attrs.showIcon = true;
        attrs.defaultCheckedKeys = $hitted.filter(selectedKey => dataKey.contains(selectedKey));
        return (
            <Tree {...attrs} {...jsx}>
                {treeData.to().map(item => renderNode(item))}
            </Tree>
        )
    }
}

export default Component;