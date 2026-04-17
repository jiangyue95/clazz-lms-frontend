import { createBrowserRouter } from "react-router-dom"
import Login from '../pages/Login'
import Home from '../pages/Home'
import ClassManagement from '../pages/clazz/ClassManagement'
import StudentManagement from '../pages/clazz/StudentManagement'
import DepartmentManagement from '../pages/system/DepartmentManagement'
import EmployeeManagement from '../pages/system/EmployeeManagement'
import EmployeeStats from '../pages/stats/EmployeeStats'
import StudentStats from '../pages/stats/StudentStats'
import LogStats from '../pages/stats/LogStats'


const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    { path: '/', element: <Home />},
    { path: '/class', element: <ClassManagement /> },
    { path: '/student', element: <StudentManagement /> },
    { path: '/department', element: <DepartmentManagement /> },
    { path: '/employee', element: <EmployeeManagement /> },
    { path: '/stats/employee', element: <EmployeeStats /> },
    { path: '/stats/student', element: <StudentStats /> },
    { path: '/stats/log', element: <LogStats /> },
])

export default router