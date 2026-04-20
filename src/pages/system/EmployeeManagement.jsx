import {Button, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, message} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {getEmpPageListApi, deleteEmpApi, addEmpApi, getEmpByIdApi, updateEmpApi} from '../../api/employee';
import {getDeptListApi} from '../../api/dept';

const genderOptions = [
  {value: 1, label: 'Male'},
  {value: 2, label: 'Female'},
];

const jobOptions = [
  {value: 1, label: 'Head Teacher'},
  {value: 2, label: 'Lecturer'},
  {value: 3, label: 'Student Affairs Supervisor'},
  {value: 4, label: 'Teaching and Research Supervisor'},
  {value: 5, label: 'Consultant'},
];

const EmployeeManagement = () => {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({page: 1, pageSize: 10});
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchForm] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deptOptions, setDeptOptions] = useState([]);
  const [modalForm] = Form.useForm();

  const fetchList = useCallback(async () => {
    setLoading(true);
    const fields = searchForm.getFieldsValue();
    const params = {
      ...pagination,
      ...fields,
      begin: fields.begin ? fields.begin.format('YYYY-MM-DD') : undefined,
      end: fields.end ? fields.end.format('YYYY-MM-DD') : undefined,
    };
    const res = await getEmpPageListApi(params);
    if (res.data.code === 1) {
      setList(res.data.data.rows);
      setTotal(res.data.data.total);
    }
    setLoading(false);
  }, [pagination, searchForm]);

  const fetchDeptOptions = useCallback(async () => {
    const res = await getDeptListApi();
    if (res.data.code === 1) {
      setDeptOptions(res.data.data.map((d) => ({
        value: d.id,
        label: d.name,
      })));
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchList();
    };
    load();
  }, [fetchList]);

  useEffect(() => {
    const load = async () => {
      await fetchDeptOptions();
    };
    load();
  }, [fetchDeptOptions]);

  const handleSearch = () => {
    setPagination({page: 1, pageSize: 10});
  };

  const handleReset = () => {
    searchForm.resetFields();
    setPagination({page: 1, pageSize: 10});
  };

  const handleDelete = async (ids) => {
    const res = await deleteEmpApi(ids);
    if (res.data.code === 1) {
      message.success('Deleted successfully');
      setSelectedIds([]);
      fetchList();
    } else {
      message.error(res.data.msg);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    modalForm.resetFields();
    setModalOpen(true);
  };

  const handleEdit = async (record) => {
    const res = await getEmpByIdApi(record.id);
    if (res.data.code === 1) {
      const data = res.data.data;
      setEditingRecord(data);
      modalForm.setFieldsValue({
        ...data,
        entryDate: data.entryDate ? dayjs(data.entryDate) : null,
        exprList: data.exprList ? data.exprList.map((expr) => ({
          ...expr,
          begin: expr.begin ? dayjs(expr.begin) : null,
          end: expr.end ? dayjs(expr.end) : null,
        })) : [],
      });
      setModalOpen(true);
    }
  };

  const handleModalOk = async () => {
    const values = await modalForm.validateFields();
    const payload = {
      ...values,
      entryDate: values.entryDate ? values.entryDate.format('YYYY-MM-DD') : null,
      exprList: values.exprList ? values.exprList.map((expr) => ({
        ...expr,
        begin: expr.begin ? expr.begin.format('YYYY-MM-DD') : null,
        end: expr.end ? expr.end.format('YYYY-MM-DD') : null,
      })) : [],
    };
    if (editingRecord) {
      const res = await updateEmpApi({...payload, id: editingRecord.id});
      if (res.data.code === 1) {
        message.success('Updated successfully');
      } else {
        message.error(res.data.msg);
      }
    } else {
      const res = await addEmpApi(payload);
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
    {title: 'Gender', dataIndex: 'gender', render: (v) => v === 1 ? 'Male' : 'Female'},
    {title: 'Job', dataIndex: 'job', render: (v) => jobOptions.find((j) => j.value === v)?.label},
    {title: 'Salary', dataIndex: 'salary'},
    {title: 'Entry Date', dataIndex: 'entryDate'},
    {title: 'Department', dataIndex: 'deptName'},
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this employee?"
            onConfirm={() => handleDelete([record.id])}
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form form={searchForm} layout="inline" style={{marginBottom: 16}}>
        <Form.Item name="name" label="Name">
          <Input placeholder="Employee name" />
        </Form.Item>
        <Form.Item name="gender" label="Gender">
          <Select options={genderOptions} placeholder="Select gender" style={{width: 120}} allowClear />
        </Form.Item>
        <Form.Item name="begin" label="Entry From">
          <DatePicker />
        </Form.Item>
        <Form.Item name="end" label="Entry To">
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleSearch}>Search</Button>
            <Button onClick={handleReset}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>

      <Space style={{marginBottom: 16}}>
        <Button type="primary" onClick={handleAdd}>Add Employee</Button>
        <Popconfirm
          title="Are you sure to delete selected employees?"
          onConfirm={() => handleDelete(selectedIds)}
          disabled={selectedIds.length === 0}
        >
          <Button danger disabled={selectedIds.length === 0}>
            Delete Selected ({selectedIds.length})
          </Button>
        </Popconfirm>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: (keys) => setSelectedIds(keys),
        }}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total,
          onChange: (page, pageSize) => setPagination({page, pageSize}),
        }}
      />

      <Modal
        title={editingRecord ? 'Edit Employee' : 'Add Employee'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        width={700}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{required: true}]}>
            <Select options={genderOptions} />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="job" label="Job" rules={[{required: true}]}>
            <Select options={jobOptions} />
          </Form.Item>
          <Form.Item name="salary" label="Salary">
            <InputNumber style={{width: '100%'}} />
          </Form.Item>
          <Form.Item name="entryDate" label="Entry Date" rules={[{required: true}]}>
            <DatePicker style={{width: '100%'}} />
          </Form.Item>
          <Form.Item name="deptId" label="Department" rules={[{required: true}]}>
            <Select options={deptOptions} />
          </Form.Item>

          <Form.List name="exprList">
            {(fields, {add, remove}) => (
              <>
                <div style={{marginBottom: 8}}>Work Experience</div>
                {fields.map(({key, name, ...restField}) => (
                  <Space key={key} align="baseline" style={{display: 'flex', marginBottom: 8}}>
                    <Form.Item {...restField} name={[name, 'begin']} rules={[{required: true}]}>
                      <DatePicker placeholder="Start date" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'end']} rules={[{required: true}]}>
                      <DatePicker placeholder="End date" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'company']} rules={[{required: true}]}>
                      <Input placeholder="Company" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'job']} rules={[{required: true}]}>
                      <Input placeholder="Position" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>Remove</Button>
                  </Space>
                ))}
                <Button onClick={() => add()}>+ Add Experience</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
