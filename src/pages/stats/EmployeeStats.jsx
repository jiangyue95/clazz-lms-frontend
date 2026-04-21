import {useCallback, useEffect, useState} from 'react';
import {Column, Pie} from '@ant-design/charts';
import {getEmpJobDataApi, getEmpGenderDataApi} from '../../api/report';

const EmployeeStats = () => {
  const [jobData, setJobData] = useState([]);
  const [genderData, setGenderData] = useState([]);

  const fetchJobData = useCallback(async () => {
     const res = await getEmpJobDataApi();
     if (res.data.code === 1) {
      const {jobList, dataList} = res.data.data;
      setJobData(jobList.map((job, i) => ({job, count: dataList[i]})));
     }
  }, []);

  const fetchGenderData = useCallback(async () => {
    const res = await getEmpGenderDataApi();
    if (res.data.code === 1) {
      setGenderData(res.data.data);
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      await fetchJobData();
    };
    load();
  }, [fetchJobData]);

  useEffect(() => {
    const load = async () => {
      await fetchGenderData();
    };
    load();
  }, [fetchGenderData]);

  return (
    <div style={{display: 'flex', gap: 24}}>
      <div style={{flex: 1}}>
        <h3>Employee Count by Job Position</h3>
        <Column data={jobData} xField="job" yField="count" />
      </div>
      <div style={{flex: 1}}>
        <h3>Employee Count by Gender</h3>
        <Pie data={genderData} angleField="value" colorField="name" />
      </div>
    </div>
  );
};

export default EmployeeStats;
