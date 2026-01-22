import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  // const [sortBy, setSortBy] = useState('created_at'); // might add sorting later

  useEffect(() => {
    fetchTasks();
  }, [filter, search]);

  // debounce search - removed for now, was too complex
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     fetchTasks();
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [search]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.status = filter;
      if (search) params.search = search;
      // console.log('Fetching tasks with params:', params);
      const response = await taskAPI.getTasks(params);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // maybe show error toast here
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(id);
        // instead of refetching, tried removing from state
        // setTasks(tasks.filter(task => task.id !== id));
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        // alert('Failed to delete task');
      }
    }
  };

  const getStatusBadge = (status) => {
    // tried using switch case but object lookup is cleaner
    // switch(status) {
    //   case 'pending': return 'bg-warning';
    //   case 'in_progress': return 'bg-info';
    //   case 'completed': return 'bg-success';
    //   default: return 'bg-secondary';
    // }
    const badges = {
      pending: 'bg-warning',
      in_progress: 'bg-info',
      completed: 'bg-success',
    };
    return badges[status] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Tasks</h2>
        <Link to="/tasks/new" className="btn btn-primary">
          Add Task
        </Link>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="alert alert-info">No tasks found</div>
      ) : (
        <div className="row">
          {tasks.map((task) => (
            <div key={task.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title">{task.title}</h5>
                    <span className={`badge ${getStatusBadge(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="card-text">{task.description}</p>
                  {task.due_date && (
                    <p className="text-muted small">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                  <div className="d-flex gap-2">
                    <Link
                      to={`/tasks/edit/${task.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
