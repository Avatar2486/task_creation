const pool = require("../config/db");

class Task {
  static async getAllTasks(userId, filters = {}) {
    try {
      const params = [userId];
      let paramIndex = 1;

      let query = `
                SELECT *
                FROM tasks
                WHERE user_id = $1
                  AND is_deleted = FALSE
            `;

      // Filter by status (optional)
      if (filters.status) {
        paramIndex++;
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
      }

      // Search by title (optional)
      if (filters.search) {
        paramIndex++;
        query += ` AND title ILIKE $${paramIndex}`;
        params.push(`%${filters.search}%`);
      }

      // Pagination defaults
      const limit = filters.limit || 10;
      const offset = filters.offset || 0;

      paramIndex++;
      query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
      params.push(limit);

      paramIndex++;
      query += ` OFFSET $${paramIndex}`;
      params.push(offset);

      const { rows } = await pool.query(query, params);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getTaskById(id, userId) {
    try {
      const query = `
                SELECT *
                FROM tasks
                WHERE id = $1
                  AND user_id = $2
                  AND is_deleted = FALSE
            `;

      const { rows } = await pool.query(query, [id, userId]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createTask(task) {
    try {
      const query = `
                INSERT INTO tasks (
                    title,
                    description,
                    status,
                    due_date,
                    user_id
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;

      const values = [
        task.title,
        task.description || null,
        task.status || "pending",
        task.due_date || null,
        task.user_id,
      ];

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async updateTask(id, userId, task) {
    try {
      const setClauses = [];
      const values = [];
      let paramIndex = 0;

      if (task.title !== undefined) {
        paramIndex++;
        setClauses.push(`title = $${paramIndex}`);
        values.push(task.title);
      }

      if (task.description !== undefined) {
        paramIndex++;
        setClauses.push(`description = $${paramIndex}`);
        values.push(task.description);
      }

      if (task.status !== undefined) {
        paramIndex++;
        setClauses.push(`status = $${paramIndex}`);
        values.push(task.status);
      }

      if (task.due_date !== undefined) {
        paramIndex++;
        setClauses.push(`due_date = $${paramIndex}`);
        values.push(task.due_date);
      }

      if (setClauses.length === 0) {
        throw new Error("No fields provided for update");
      }

      // Where clause params
      paramIndex++;
      values.push(id);

      paramIndex++;
      values.push(userId);

      const query = `
                UPDATE tasks
                SET ${setClauses.join(", ")}
                WHERE id = $${paramIndex - 1}
                  AND user_id = $${paramIndex}
                  AND is_deleted = FALSE
                RETURNING *
            `;

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteTask(id, userId, softDelete = true) {
    try {
      const query = softDelete
        ? `
                    UPDATE tasks
                    SET is_deleted = TRUE
                    WHERE id = $1
                      AND user_id = $2
                      AND is_deleted = FALSE
                    RETURNING *
                `
        : `
                    DELETE FROM tasks
                    WHERE id = $1
                      AND user_id = $2
                    RETURNING *
                `;

      const { rows } = await pool.query(query, [id, userId]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async getTaskCount(userId, filters = {}) {
    try {
      const params = [userId];
      let paramIndex = 1;

      let query = `
                SELECT COUNT(*)
                FROM tasks
                WHERE user_id = $1
                  AND is_deleted = FALSE
            `;

      if (filters.status) {
        paramIndex++;
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
      }

      if (filters.search) {
        paramIndex++;
        query += ` AND title ILIKE $${paramIndex}`;
        params.push(`%${filters.search}%`);
      }

      const { rows } = await pool.query(query, params);
      return Number(rows[0].count);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Task;
