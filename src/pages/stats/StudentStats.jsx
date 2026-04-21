import {useCallback, useEffect, useState} from 'react';
import {Column, Pie} from '@ant-design/charts';
import {getStudentCountDataApi, getStudentDegreeDataApi} from '../../api/report'

const StudentStats = () => {
  const [countData, setCountData] = useState([]);
  const [degreeData, setDegreeData] = useState([]);

  const fetchCountData = useCallback(async () => {
    const res = await getStudentCountDataApi();
    if (res.data.code === 1) {
      const {clazzList, dataList} = res.data.data;
      setCountData(clazzList.map((clazz, i) => ({clazz, count: dataList[i]})));
    }
  }, []);

  const fetchDegreeData = useCallback(async () => {
    const res = await getStudentDegreeDataApi();
    if (res.data.code == 1) {
      setDegreeData(res.data.data);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchCountData();
    };
    load();
  }, [fetchCountData]);

  useEffect(() => {
    const load = async () => {
      await fetchDegreeData();
    };
    load();
  }, [fetchDegreeData]);

  return (
    <div style={{display:'flext', gap: 24}}>
      <div style={{flex: 1}}>
        <h3>Student Count per Class</h3>
        <Column data={countData} xField="clazz" yField="count" />
      </div>
      <div style={{flex: 1}}>
        <h3>Student Count by Degree</h3>
        <Pie data={degreeData} angleField="value" colorField="name" />
      </div>
    </div>
  );
}

export default StudentStats;
