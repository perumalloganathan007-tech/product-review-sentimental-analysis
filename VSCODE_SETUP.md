# VS Code Setup and Extensions

## Recommended Extensions

This project includes a `.vscode/extensions.json` file with recommended extensions for optimal development experience:

### Essential Extensions
- **Scala (Metals)** - Primary Scala language support
- **MySQL Tools** - MySQL database management and syntax highlighting
- **SQLTools** - Database connection and query execution

### Extension Installation
1. Open the project in VS Code
2. VS Code will show a notification to install recommended extensions
3. Click "Install All" or install them individually from the Extensions panel

## SQL File Configuration

The project uses **MySQL syntax** in evolution files. To prevent SQL Server linter false positives:

### Automatic Configuration
- VS Code workspace settings are pre-configured for MySQL
- File associations map `.sql` files to MySQL dialect
- MSSQL extension IntelliSense is disabled for this workspace

### Manual Steps (if issues persist)
1. **Disable MSSQL Extension**: Go to Extensions → Search "mssql" → Disable for this workspace
2. **Install MySQL Extension**: Install "MySQL" by formulahendry
3. **Restart VS Code**: Close and reopen VS Code to apply settings
4. **Verify File Association**: Check that `.sql` files show "MySQL" in the status bar

## Project Structure

```text
.vscode/
├── settings.json      # Workspace-specific VS Code settings
├── extensions.json    # Recommended extensions
└── launch.json        # Debug configurations (if needed)

conf/
├── application.conf   # Database and app configuration
├── routes            # URL routing definitions
└── evolutions/       # Database migration scripts
    └── default/
        └── 1.sql     # Initial database schema (MySQL syntax)
```

## Development Workflow

1. **Database Setup**: Follow DATABASE.md for MySQL installation
2. **Install Extensions**: Accept VS Code extension recommendations  
3. **Configure Database**: Update `conf/application.conf` with your credentials
4. **Run Application**: Use `sbt run` to start the development server
5. **Access Application**: Navigate to [http://localhost:9000](http://localhost:9000)

## Troubleshooting

### SQL Syntax Errors in VS Code
- **Symptom**: Red underlines in `.sql` files with "Incorrect syntax" messages
- **Cause**: VS Code using SQL Server linter instead of MySQL
- **Solution**: Follow the manual steps above to configure MySQL support

### Database Connection Issues
- **Check MySQL Service**: Ensure MySQL is running on port 3306
- **Verify Credentials**: Update username/password in `application.conf`
- **Create Database**: Run `CREATE DATABASE sentiment_analysis;` in MySQL

### Extension Conflicts
- **Disable Conflicting Extensions**: Disable any SQL Server or generic SQL extensions
- **Use Workspace Settings**: Extensions should be configured per workspace, not globally