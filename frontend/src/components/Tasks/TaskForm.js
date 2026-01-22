import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskAPI } from '../../services/api';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      fetchTask();
    }
  }, [id]);

  // tried using [] dependency but got warning about id
  // useEffect(() => {
  //   if (isEdit) fetchTask();
  // }, []);

  const fetchTask = async () => {
    try {
      const response = await taskAPI.getTask(id);
      const task = response.data.data;
      // console.log('Fetched task:', task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        due_date: task.due_date
          ? new Date(task.due_date).toISOString().split('T')[0]
          : '',
      });
    } catch (error) {
      // console.error('Error fetching task:', error);
      setError('Failed to fetch task');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // client side validation - backend handles this now
    // if (!formData.title.trim()) {
    //   setError('Title is required');
    //   setLoading(false);
    //   return;
    // }

    try {
      if (isEdit) {
        await taskAPI.updateTask(id, formData);
        // console.log('Task updated:', id);
      } else {
        await taskAPI.createTask(formData);
        // console.log('Task created');
      }
      navigate('/tasks');
    } catch (err) {
      // console.error('Error saving task:', err);
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">
                {isEdit ? 'Edit Task' : 'Create Task'}
              </h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    name="due_date"
                    className="form-control"
                    value={formData.due_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Task'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/tasks')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
