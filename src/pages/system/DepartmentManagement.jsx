import {Button, Form, Input, Modal, Popconfirm, Space, Table, message} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {addDeptApi, deleteDeptApi, getDeptByIdApi, getDeptListApi, updateDeptApi} from '../../api/dept';

const DepartmentManagement = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalForm] = Form.useForm();

  const fetchList = useCallback(async () => {
    setLoading(true);
    const res = await getDeptListApi();
    if (res.data.code === 1) {
      setList(res.data.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchList();
    };
    load();
  }, [fetchList]);

  const handleAdd = () => {
    setEditingRecord(null);
    modalForm.resetFields();
    setModalOpen(true);
  };

  const handleEdit = async (record) => {
    const res = await getDeptByIdApi(record.id);
    if (res.data.code === 1) {
      setEditingRecord(res.data.data);
      modalForm.setFieldsValue(res.data.data);
      setModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteDeptApi(id);
    if (res.data.code === 1) {
      message.success('Deleted successfully');
      fetchList();
    } else {
      message.error(res.data.msg);
    }
  };

  const handleModalOk = async () => {
    const values = await modalForm.validateFields();
    if (editingRecord) {
      const res = await updateDeptApi({...values, id: editingRecord.id});
      if (res.data.code === 1) {
        message.success('Update successfully');
      } else {
        message.error(res.data.msg);
      }
    } else {
      const res = await addDeptApi(values);
      if (res.data.code === 1) {
        message.success('Added successfully');
      } else {
        message.error(res.data.msg);
      }
    }
    setModalOpen(false);
    fetchList();
  };

  const columns = [
    {title: 'Name', dataIndex: 'name'},
    {title: 'Create Time', dataIndex: 'createTime'},
    {title: 'Update Time', dataIndex: 'updateTime'},
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this department?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" style={{marginBottom: 16}} onClick={handleAdd}>
        Add Department
      </Button>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
      />

      <Modal
        title={editingRecord ? 'Edit Department' : 'Add Department'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{required: true}]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;
