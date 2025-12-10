# Database Configuration Guide

## Overview

This Scala Play Framework application uses **MySQL** as the primary database system. The SQL schema files are written in MySQL syntax and are designed to work with MySQL 5.7+ and MariaDB.

## Important Notes

### SQL Syntax
- The `conf/evolutions/default/1.sql` file uses **MySQL syntax**
- If VS Code shows SQL Server syntax errors, these are **false positives**
- The application is configured for MySQL in `conf/application.conf`

### Database Setup

1. **Install MySQL 5.7+ or MariaDB**
2. **Create Database:**
   ```sql
   CREATE DATABASE sentiment_analysis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Update Configuration:**
   Edit `conf/application.conf` with your database credentials:
   ```hocon
   db.default.url="jdbc:mysql://localhost:3306/sentiment_analysis"
   db.default.username=your_username
   db.default.password=your_password
   ```

4. **Run Migrations:**
   Play Framework will automatically run the evolution scripts on first startup.

## Troubleshooting

### SQL Server Linter Errors
If you see errors like "Incorrect syntax near 'AUTO_INCREMENT'" or "'DATASET'":
- These are **false positives** from SQL Server linter
- The project uses **MySQL**, not SQL Server
- The VS Code settings have been configured to use MySQL dialect
- Install the recommended MySQL extensions from `.vscode/extensions.json`
- Restart VS Code to apply the configuration changes
- The file contains `@mssql-ignore-file` directive to disable MSSQL validation

### Connection Issues
- Ensure MySQL service is running
- Check firewall settings allow connection to port 3306
- Verify database credentials in `application.conf`
- Ensure the database `sentiment_analysis` exists

## Alternative Databases

While MySQL is recommended, you can adapt the schema for other databases:

### PostgreSQL
- Change `AUTO_INCREMENT` to `SERIAL`
- Update driver in `application.conf` to PostgreSQL
- Modify `VARCHAR` constraints as needed

### H2 (Development Only)
- Use `IDENTITY` instead of `AUTO_INCREMENT`
- Update configuration for H2 in-memory database
- Good for testing but not recommended for production