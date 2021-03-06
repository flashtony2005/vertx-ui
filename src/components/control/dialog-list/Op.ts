import Ux from 'ux';
import Mock from './mock';

const $opSave = (reference: any) => Ux.ai2Event(reference, (values, mockData) => {
    console.info(values);
});
const $opAdd = (reference: any) => Ux.ai2Event(reference, (values, mockData) => {
    console.info(values);
});
const opEditPost = (reference: any) => (record: any, id: any) => {
    // 在编辑点击过后操作，将数据写入到items
    const mockData = Mock.fnUsers;
    let dataArray = mockData.mock ? mockData.data : (
        record["users"] ? record["users"] : []
    );
    // 读取当前记录中的子列表
    dataArray = dataArray.filter(item => item.deptId === id);
    // 从$items（DataObject）中更新id = dataArray的子列表
    const {$items} = reference.props;
    const dataRecord = Ux.rapitRecord($items, id, dataArray);
    // 将最终生成的Record写入到状态树 list.items
    Ux.writeTree(reference, {
        "list.items": dataRecord
    })
};
export default {
    $opSave,
    $opAdd,
    opEditPost
}