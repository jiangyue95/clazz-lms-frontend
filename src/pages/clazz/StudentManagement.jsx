import {Button, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, message} from 'antd';
import {useEffect, useState, useCallback} from 'react';
import {getStudentListApi, deleteStudentApi, violationStudentApi, getStudentByIdApi, updateStudentApi, addStudentApi} from '../../api/student';
import {getClazzListApi} from '../../api/clazz';
import dayjs from 'dayjs';

const degreeOptions = [
  {value: 1, label: 'Junior High School'},
  {value: 2, label: 'High School'},
  {value: 3, label: 'Associate'},
  {value: 4, label: 'Bachelor'},
  {value: 5, label: 'Master'},
  {value: 6, label: 'Doctor'},
];

const StudentManagement = () => {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({page: 1, pageSize: 5});
  const [violationModalOpen, setViolationModalOpen] = useState(false);
  const [violationStudentId, setViolationStudentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [clazzOptions, setClazzOptions] = useState([]);
  const [modalForm] = Form.useForm();
  const [violationForm] = Form.useForm();
  const [searchForm] = Form.useForm();

  const fetchList = useCallback(async () => {
    setLoading(true);
    const fields = searchForm.getFieldsValue();
    const params = {...pagination, ...fields};
    const res = await getStudentListApi(params);
    if (res.data.code === 1) {
      setList(res.data.data.rows);
      setTotal(res.data.data.total);
    }
    setLoading(false);
  }, [pagination, searchForm]);

  const fetchClazzOptions = useCallback(async () => {
    const res = await getClazzListApi();
    if (res.data.code === 1) {
      setClazzOptions(res.data.data.rows.map((c) => ({
        value: c.id,
        label: c.name,
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
      await fetchClazzOptions();
    };
    load();
  }, [fetchClazzOptions]);

  const handleSearch = () => {
    setPagination({page: 1, pageSize: 5});
  };

  const handleReset = () => {
    searchForm.resetFields();
    setPagination({page: 1, pageSize: 5});
  };

  const handleDelete = async (id) => {
    const res = await deleteStudentApi(id);
    if (res.data.code === 1) {
      message.success('Deleted successfully');
      fetchList();
    } else {
      message.error(res.data.msg);
    }
  }

  const handleAdd = () => {
    setEditingRecord(null);
    modalForm.resetFields();
    setModalOpen(true);
  }

  const handleEdit = async (record) => {
    const res = await getStudentByIdApi(record.id);
    if (res.data.code === 1) {
      const data = res.data.data;
      setEditingRecord(data);
      modalForm.setFieldsValue({
        ...data,
        graduationDate: data.graduationDate ? dayjs(data.graduationDate) : null,
      });
      setModalOpen(true);
    }
  };

  const handleModalOk = async () => {
    const values = await modalForm.validateFields();
    const payload = {
      ...values,
      graduationDate: values.graduationDate ? values.graduationDate.format('YYYY-MM-DD') : null,
    };
    if (editingRecord) {
      const res = await updateStudentApi({...payload, id: editingRecord.id});
      if (res.data.code === 1) {
        message.success('Updated successfully');
      } else {
        message.error(res.data.msg);
      }
    } else {
      const res = await addStudentApi(payload);
      if (res.data.code === 1) {
        message.success('Added successfully');
      } else {
        message.error(res.data.msg);
      }
    }
    setModalOpen(false);
    fetchList();
  }

  const handleViolationOpen = (id) => {
    setViolationStudentId(id);
    violationForm.resetFields();
    setViolationModalOpen(true);
  }

  const handleViolationOk = async () => {
    const values = await violationForm.validateFields();
    const res = await violationStudentApi(violationStudentId, values.score);
    if (res.data.code === 1) {
      message.success('Violation recorded successfully');
      setViolationModalOpen(false);
      fetchList();
    } else {
      message.error(res.data.msg);
    }
  }

  const columns = [
    {title: 'No', dataIndex: 'no'},
    {title: 'Name', dataIndex: 'name'},
    {
      title: 'Gender',
      dataIndex: 'gender',
      render: (v) => (v === 1 ? 'Male' : 'Female'),
    },
    {title: 'Phone', dataIndex: 'phone'},
    {
      title: 'Degree',
      dataIndex: 'degree',
      render: (v) => degreeOptions.find((d) => d.value === v)?.label,
    },
    {title: 'Class', dataIndex: 'clazzName'},
    {title: 'Violation Count', dataIndex: 'violationCount'},
    {title: 'Violation Score', dataIndex: 'violationScore'},
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this student?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
          <Button type="link" onClick={() => handleViolationOpen(record.id)}>Violation</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form form={searchForm} layout="inline" style={{marginBottom: 16}}>
        <Form.Item name="name" label="Name">
          <Input placeholder="Student name" />
        </Form.Item>
        <Form.Item name="degree" label="Degree">
          <Select
            options={degreeOptions}
            placeholder="Select degree"
            style={{width: 150}}
            allowClear
          />
        </Form.Item>
        <Form.Item name="clazzId" label="Class">
          <Select
            options={clazzOptions}
            placeholder="Select class"
            style={{width: 200}}
            allowClear
            showSearch
            optionLabelProp="label"
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleSearch}>Search</Button>
            <Button onClick={handleReset}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>

      <Button type="primary" style={{marginBottom: 16}} onClick={handleAdd}>Add Student</Button>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total,
          onChange: (page, pageSize) => setPagination({page, pageSize}),
        }}
      />

      <Modal
        title="Violation Handling"
        open={violationModalOpen}
        onOk={handleViolationOk}
        onCancel={() => setViolationModalOpen(false)}
      >
        <Form form={violationForm} layout="vertical">
          <Form.Item
            name="score"
            label="Deduction Score"
            rules={[{required: true, message: 'Please enter deduction score'}]}
          >
            <InputNumber min={1} style={{width: '100%'}} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingRecord ? 'Edit Student' : 'Add Student'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item name="no" label="No" rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{required: true}]}>
            <Select options={[
              {value: 1, label: 'Male'},
              {value: 2, label: 'Female'},
            ]} />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item name="degree" label="Degree" rules={[{required: true}]}>
            <Select options={degreeOptions} />
          </Form.Item>
          <Form.Item name="idCard" label="ID Card" rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item name="isCollege" label="Is College Student" rules={[{required: true}]}>
            <Select options={[
              {value: 1, label: 'Yes'},
              {value: 0, label: 'No'},
            ]} />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item name="graduationDate" label="Graduation Date" rules={[{required: true}]}>
            <DatePicker style={{width: '100%'}} />
          </Form.Item>
          <Form.Item name="clazzId" label="Class" rules={[{required: true}]}>
            <Select options={clazzOptions} showSearch optionLabelProp="label" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentManagement;
