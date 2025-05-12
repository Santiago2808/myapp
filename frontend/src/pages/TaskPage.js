import { useEffect, useState } from 'react';
import axios from '../config/axiosConfig';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      const res = await axios.get('get-assigned-tasks.php');
      setTasks(res.data.tasks);
    };
    fetchAssignedTasks();
  }, []);

  return (
    <div className="tasks-page">
      <h2>Mis tareas asignadas</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.name} — entrega: {task.due_date} — proyecto: {task.project_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
