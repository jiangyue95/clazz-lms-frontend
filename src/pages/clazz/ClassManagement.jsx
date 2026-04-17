import { Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Space, Table, message } from "antd"
import { useEffect, useState } from 'react'
import dayjs from "dayjs"
import { addClazzApi, deleteClazzApi, getClazzListApi, updateClazzApi, getClazzByIdApi } from "../../api/clazz"
import { getEmpListApi } from "../../api/employee"

const ClassManagement = () => {
    const [list, setList] = useState([])
    const [total, setTotal]= useState(0)
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [empOptions, setEmpOptions] = useState([])
    const [searchForm] = Form.useForm()
    const [modalForm] = Form.useForm()
    const [pagination, setPagination] = useState({page: 1, pageSize: 5})
    
    const fetchList = async () => {
        setLoading(true)
        const fields = searchForm.getFieldsValue()
        const params = {
            ...pagination,
            ...fields,
            begin: fields.begin ? fields.begin.format('YYYY-MM-DD') : undefined,
            end: fields.end ? fields.end.format('YYYY-MM-DD') : undefined,
        }
        const res = await getClazzListApi(params)
        if (res.data.code === 1) {
            setList(res.data.data.rows)
            setTotal(res.data.data.total)
        }
        setLoading(false)
    }

    const fetchEmpOptions = async () => {
        const res = await getEmpListApi()
        if (res.data.code === 1) {
            setEmpOptions(res.data.data.map(emp => ({
                value: emp.id,
                label: emp.name,
            })))
        }
    }

    useEffect(() => {
        const load = async () => {
            await fetchList()
        }
        load()
    }, [pagination, refreshKey])

    useEffect(() => {
        const load = async () => {
            await fetchEmpOptions()
        }
        load()
    }, [])

    const handleSearch = () => {
        setPagination({ page: 1, pageSize: 5 })
    }

    const handleReset = () => {
        searchForm.resetFields()
        setPagination({ page: 1, pageSize: 5 })
    }

    const handleAdd = () => {
        setEditingRecord(null)
        modalForm.resetFields()
        setModalOpen(true)
    }

    const handleEdit = async (record) => {
        const res = await getClazzByIdApi(record.id)
        if (res.data.code === 1) {
            const data = res.data.data
            setEditingRecord(res.data.data)
            modalForm.setFieldsValue({
                ...data,
                beginDate: data.beginDate ? dayjs(data.beginDate) : null,
                endDate: data.endDate ? dayjs(data.endDate) : null,
            })
            setModalOpen(true)
        }
    }

    const handleDelete = async(id) => {
        const res = await deleteClazzApi(id)
        if (res.data.code === 1) {
            message.success('Deleted successfully')
            setRefreshKey(k => k + 1)
        } else {
            message.error(res.data.msg)
        }
    }

    const handleModalOk = async () => {
        const values = await modalForm.validateFields()
        const payload = {
            ...values,
            beginDate: values.beginDate ? values.beginDate.format('YYYY-MM-DD') : null,
            endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
        }
        if (editingRecord) {
            const res = await updateClazzApi({ ...payload, id: editingRecord.id })
            if (res.data.code === 1) {
                message.success('Updated successfully')
            }
        } else {
            const res = await addClazzApi(values)
            if (res.data.code === 1) {
                message.success('Added successfully')
            }
        }
        setModalOpen(false)
        setRefreshKey(k => k + 1)
    }

    const columns = [
        { title: 'Name', dataIndex: 'name' },
        { title: 'Room', dataIndex: 'room' },
        { title: 'Begin Date', dataIndex: 'beginDate' },
        { title: 'End Date', dataIndex: 'endDate' },
        { title: 'Master', dataIndex: 'masterName' },
        { title: 'Status', dataIndex: 'status' },
        {
            title: 'Actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure to delete this class?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
                <Form.Item name="name" label="Name">
                    <Input placeholder="Class name" />
                </Form.Item>
                <Form.Item name="begin" label="Begin Date">
                    <DatePicker />
                </Form.Item>
                <Form.Item name="end" label="End Date">
                    <DatePicker />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" onClick={handleSearch}>Search</Button>
                        <Button onClick={handleReset}>Reset</Button>
                    </Space>
                </Form.Item>
            </Form>

            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Add Class
            </Button>

            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={list}
                pagination={{
                    current: pagination.page,
                    pageSize: pagination.pageSize,
                    total,
                    onChange: (page, pageSize) => setPagination({ page, pageSize }),
                }}
            />

            <Modal
                title={editingRecord ? 'Edit Class' : 'Add Class' }
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={() => setModalOpen(false)}
            >
                <Form form={modalForm} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="room" label="Room" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="beginDate" label="Begin Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="masterId" label="Master ID" rules={[{ required: true }]}>
                        <Select
                            options={empOptions}
                            placeholder="Select a master"
                            showSearch
                            optionLabelProp="label"
                        />
                    </Form.Item>
                    <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
                        <Select options={[
                            { value: 1, label: 'Java' },
                            { value: 2, label: 'Front End' },
                            { value: 3, label: 'Big Data' },
                        ]} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ClassManagement