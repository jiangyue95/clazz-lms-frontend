import {Table} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {getLogPageApi} from '../../api/log';

const columns = [
  {title: 'Operator', dataIndex: 'operateEmpName'},
  {title: 'Operate Time', dataIndex: 'operateTime'},
  {title: 'Class', dataIndex: 'className'},
  {title: 'Method', dataIndex: 'methodName'},
  {title: 'Params', dataIndex: 'methodParams', ellipsis: true},
  {title: 'Return Value', dataIndex: 'returnValue', ellipsis: true},
  {title: 'Cost Time (ms)', dataIndex: 'costTime'},
];

const LogStats = () => {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({page: 1, pageSize: 10});

  const fetchList = useCallback(async () => {
    setLoading(true);
    const res = await getLogPageApi(pagination);
    if (res.data.code === 1) {
      setList(res.data.data.rows);
      setTotal(res.data.data.total);
    }
    setLoading(false);
  }, [pagination]);

  useEffect(() => {
    const load = async () => {
      await fetchList();
    };
    load();
  }, [fetchList]);

  return (
    <div>
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
    </div>
  )
}

export default LogStats;
