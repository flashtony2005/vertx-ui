import {v4} from 'uuid';
import Ux from 'ux';
import Init from './Op.Init';
import Mock from './Op.Mock';
import Immutable from 'immutable';

const stateAddTab = (reference) => {
    let {tabs = {}} = reference.state;
    tabs = Immutable.fromJS(tabs).toJS();
    const type = tabs.items.filter(item => "add" === item.type);
    if (0 < type.length) {
        tabs.activeKey = type[0].key;
    } else {
        const options = Init.readOption(reference);
        const tab = {};
        tab.key = v4();
        tab.tab = options['tabs.add'];
        tab.type = "add";
        tab.index = tabs.items.length;
        tabs.items.push(tab);
        tabs.activeKey = tab.key;
    }
    return tabs;
};

const stateEditTab = (reference, id, params) => {
    let {tabs = {}} = reference.state;
    tabs = Immutable.fromJS(tabs).toJS();
    const found = tabs.items.filter(item => item.key === id);
    if (0 < found.length) {
        tabs.activeKey = found[0].key;
    } else {
        const options = Init.readOption(reference);
        const tab = {};
        tab.key = id;
        tab.tab = Ux.formatExpr(options['tabs.edit'], params);
        tab.type = "edit";
        tab.index = tabs.items.length;
        tabs.items.push(tab);
        tabs.activeKey = tab.key;
    }
    return tabs;
};
const rxAdd = (reference) => (event) => {
    event.preventDefault();
    const view = Init.stateView("add", undefined, reference);
    const tabs = stateAddTab(reference);
    reference.setState({tabs, ...view});
};

const rxEdit = (reference, id) => {
    const {$self} = reference.props;
    const options = Init.readOption($self);
    const uri = options['ajax.get.uri'];
    // Mock专用数据
    const mockData = Mock.mockDetail($self, id);
    const promise = Ux.ajaxGet(uri, {id}, mockData);
    promise.then(data => {
        let {record = {}} = $self.state;
        record[id] = data;
        record = Immutable.fromJS(record).toJS();
        $self.setState({record});
        const tabs = stateEditTab($self, id, data);
        const view = Init.stateView("edit", id, reference);
        $self.setState({tabs, ...view});
        const {rxEditPost} = reference.props;
        if (rxEditPost) {
            rxEditPost(data, id);
        }
    })
};

const rxDeleteDetail = (reference, id) => {
    const options = Init.readOption(reference);
    const uri = options['ajax.delete.uri'];
    const promise = Ux.ajaxDelete(uri, {id}, Mock.mockDelete(reference, id));
    promise.then(data => {
        // 删除record数据
        let {record = {}} = reference.state;
        record = Immutable.fromJS(record).toJS();
        if (record[id]) delete record[id];
        // 计算tabs页
        let {tabs = {}} = reference.state;
        tabs = Immutable.fromJS(tabs).toJS();
        tabs.items = tabs.items.filter(item => id !== item.key);
        tabs.activeKey = tabs.items[0].key;
        const view = Init.stateView("list", undefined, reference);
        reference.setState({tabs, ...view, record});
        Ux.writeTree(reference, {
            "grid.list": undefined
        });// rxView函数的触发
        const {rxDeletePost} = reference.props;
        if (rxDeletePost) {
            rxDeletePost(data, id);
        }
    });
};

const rxDelete = (reference, id) => {
    const {$self} = reference.props;
    rxDeleteDetail($self, id)
};

const rxClose = (reference, item) => () => {
    // 关闭时处理tab页
    let {tabs = {}} = reference.state;
    tabs = Immutable.fromJS(tabs).toJS();
    tabs.items = tabs.items.filter(each => each.key !== item.key);
    tabs.activeKey = tabs.items[0].key;
    // 计算view
    const view = Init.stateView("list", undefined, reference);
    reference.setState({tabs, ...view});
    // 写状态树，重新加载List
    Ux.writeTree(reference, {"grid.list": undefined})
};
const rxFilter = (reference = {}) => (value, event) => {
    const $query = Init.readQuery(reference);
    const options = Init.readOption(reference);
    const search = options['search.cond'];
    const filters = {};
    if (value) {
        search.forEach(term => filters[term] = value);
    }
    if (!$query.criteria) {
        $query.criteria = {};
    }
    if (0 < search.length && 0 < Object.keys(filters).length) {
        $query.criteria[""] = true;
        $query.criteria["$2"] = filters;
    }
    Ux.writeTree(reference, {
        "grid.query": $query,
        "grid.list": undefined
    })
};
const rxClear = (reference = {}) => () => {
    const query = Init.readQuery(reference);
    const options = Init.readOption(reference);
    const search = options['search.cond'];
    search.forEach(term => delete query.criteria[term]);
    reference.setState({term: ""});
    Ux.writeTree(reference, {
        "grid.query": query,
        "grid.list": undefined
    })
};
const rxInput = (reference = {}) => (event) => {
    const term = event.target.value;
    reference.setState({term})
};
export default {
    rxAdd,
    rxEdit,
    rxDelete,
    rxDeleteDetail,
    rxClose,
    rxFilter,
    rxClear,
    rxInput
}