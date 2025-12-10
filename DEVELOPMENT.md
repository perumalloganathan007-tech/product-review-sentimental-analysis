# Sentiment Analysis NLP - Development Guide

## Quick Start

1. **Setup Database**:

   ```bash
   mysql -u root -p
   CREATE DATABASE sentiment_analysis;
   ```

2. **Run Application**:

   ```bash
   sbt run
   ```

3. **Access Application**: [http://localhost:9000](http://localhost:9000)

## Development Commands

- `sbt run` - Start development server
- `sbt test` - Run tests
- `sbt compile` - Compile project
- `sbt clean` - Clean build files

## Project Structure

```text
app/
├── controllers/     # HTTP request handlers
├── models/         # Data models and database tables
├── services/       # Business logic and NLP processing
└── views/          # HTML templates

conf/
├── application.conf # Configuration
├── routes          # URL routing
└── evolutions/     # Database migrations

public/
├── javascripts/    # Frontend JavaScript
└── stylesheets/    # CSS styles

test/              # Unit and integration tests
```

## Environment Variables

```bash
export DATABASE_URL="jdbc:mysql://localhost:3306/sentiment_analysis"
export DB_USERNAME="your_username"
export DB_PASSWORD="your_password"
```

## Testing

```bash
# Run all tests
sbt test

# Run specific test
sbt "testOnly services.NLPServiceSpec"

# Test with coverage
sbt coverage test coverageReport
```
