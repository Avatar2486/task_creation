const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function setupDatabase() {
    try {
        console.log('Connecting to PostgreSQL');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Creating database');
        await pool.query(schema);

        console.log('DATABASE MADE');

        // check if users already exist
        const existingUsers = await pool.query('SELECT COUNT(*) as count FROM users');

        if (existingUsers.rows[0].count > 0) {
            console.log('Users already exist. Skipping user creation.');
            console.log('To recreate users, delete them manually or drop the users table.');
            console.log('\nDatabase setup completed successfully!');
            process.exit(0);
        }

        console.log('Creating test users...');

        // admin users
        const adminUsers = [
            { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
            { name: 'Super Admin', email: 'superadmin@example.com', password: 'admin123', role: 'admin' }
        ];

        // regular users
        const regularUsers = [
            { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' },
            { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'user' },
            { name: 'Mike Johnson', email: 'mike@example.com', password: 'password123', role: 'user' },
            { name: 'Sarah Williams', email: 'sarah@example.com', password: 'password123', role: 'user' },
            { name: 'David Brown', email: 'david@example.com', password: 'password123', role: 'user' },
            { name: 'Emma Davis', email: 'emma@example.com', password: 'password123', role: 'user' },
            { name: 'Chris Wilson', email: 'chris@example.com', password: 'password123', role: 'user' },
            { name: 'Lisa Anderson', email: 'lisa@example.com', password: 'password123', role: 'user' },
            { name: 'Tom Martinez', email: 'tom@example.com', password: 'password123', role: 'user' },
            { name: 'Amy Taylor', email: 'amy@example.com', password: 'password123', role: 'user' }
        ];

        const allUsers = [...adminUsers, ...regularUsers];

        // create all users
        for (const user of allUsers) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
                [user.name, user.email, hashedPassword, user.role]
            );

            console.log(`${user.role === 'admin' ? 'Admin' : 'User'} created: ${user.email} (password: ${user.password})`);
        }


        console.log('Database setup completed successfully!');
        console.log(`Created ${allUsers.length} users (${adminUsers.length} admins, ${regularUsers.length} regular users)`);
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error.message);
        process.exit(1);
    }
}

setupDatabase();
