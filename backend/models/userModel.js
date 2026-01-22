const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
    static async create(userData) {
        try {
            const { name, email, password, role = 'user' } = userData;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const query = `
                INSERT INTO users (name, email, password, role)
                VALUES ($1, $2, $3, $4)
                RETURNING id, name, email, role, created_at
            `;
            const values = [name, email, hashedPassword, role];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const result = await pool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const query = 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getAllUsers() {
        try {
            const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(id, updates) {
        try {
            const fields = [];
            const values = [];
            let paramCount = 0;

            if (updates.name !== undefined) {
                paramCount++;
                fields.push(`name = $${paramCount}`);
                values.push(updates.name);
            }

            if (updates.email !== undefined) {
                paramCount++;
                fields.push(`email = $${paramCount}`);
                values.push(updates.email);
            }

            if (updates.password !== undefined) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(updates.password, salt);
                paramCount++;
                fields.push(`password = $${paramCount}`);
                values.push(hashedPassword);
            }

            if (updates.role !== undefined) {
                paramCount++;
                fields.push(`role = $${paramCount}`);
                values.push(updates.role);
            }

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            paramCount++;
            values.push(id);

            const query = `
                UPDATE users
                SET ${fields.join(', ')}
                WHERE id = $${paramCount}
                RETURNING id, name, email, role, created_at, updated_at
            `;

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async comparePassword(candidatePassword, hashedPassword) {
        try {
            return await bcrypt.compare(candidatePassword, hashedPassword);
        } catch (error) {
            throw error;
        }
    }

    static generateToken(userId, email, role) {
        return jwt.sign(
            { id: userId, email, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
