const express = require('express');
const fs = require('fs').promises; // Use promises for async file operations
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// POST Method - Creates/Adds new data to JSON file
app.post('/data', async (req, res) => {
    try {
        // Input validation
        const { name, age, city } = req.body;
        if (!name || !age || !city) {
            return res.status(400).json({ message: 'Missing required fields: name, age, city' });
        }
        if (typeof name !== 'string' || typeof city !== 'string' || typeof age !== 'number') {
            return res.status(400).json({ message: 'Invalid data types: name and city must be strings, age must be a number' });
        }
        if (age < 0 || age > 150) {
            return res.status(400).json({ message: 'Invalid age: must be between 0 and 150' });
        }

        const newData = {
            id: Date.now(), // Auto-generate unique ID
            name,
            age,
            city
        };

        // Read existing data
        let existingData = [];
        try {
            const fileContent = await fs.readFile('data.json', 'utf8');
            existingData = JSON.parse(fileContent);
            if (!Array.isArray(existingData)) {
                throw new Error('Invalid data format in data.json');
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                // Handle non-"file not found" errors
                throw error;
            }
            // If file doesn't exist, start with empty array
        }

        // Check for duplicate ID
        if (existingData.some(item => item.id === newData.id)) {
            return res.status(409).json({ message: 'ID conflict: please try again' });
        }

        // Add new data to existing array
        existingData.push(newData);

        // Write back to file
        await fs.writeFile('data.json', JSON.stringify(existingData, null, 2));

        res.status(201).json({
            message: 'Data CREATED successfully using POST',
            data: newData,
            totalRecords: existingData.length
        });
    } catch (error) {
        console.error('Error in POST /data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('• POST: Creates new records, generates ID automatically');
    console.log('• PUT: Updates existing records, requires specific ID (not implemented yet)');
});