const http = require('http');
const mongoose = require('mongoose');
const fs = require('fs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/school');

// Simple Student Schema - just name and email
const studentSchema = new mongoose.Schema({
  name: String,
  email: String
});

const Student = mongoose.model('Student', studentSchema);

// Simple function to get form data from request
function getFormData(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    callback(JSON.parse(body));
  });
}

// Create server
const server = http.createServer(async (req, res) => {
  // Enable CORS for frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Serve HTML page
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile('index.html', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
  
  // Handle form submission
  else if (req.method === 'POST' && req.url === '/submit') {
    getFormData(req, async (formData) => {
      try {
        // Save student to database
        const student = new Student({
          name: formData.name,
          email: formData.email
        });
        
        await student.save();
        
        // Send success response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Student saved!' }));
      } catch (error) {
        // Send error response
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Error saving student' }));
      }
    });
  }
  
  // Get all students
  else if (req.method === 'GET' && req.url === '/students') {
    try {
      const students = await Student.find({});
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(students));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error fetching students' }));
    }
  }
  
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Make sure MongoDB is running!');
});