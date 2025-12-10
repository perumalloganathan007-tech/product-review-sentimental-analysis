module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {},
    "overrides": [
        {
            "files": ["webscraper.js"],
            "rules": {
                // Disable all rules for webscraper.js
            }
        }
    ]
};
