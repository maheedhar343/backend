document.getElementById('studentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            try {
                // Send data to server using Axios
                const response = await axios.post('http://localhost:3000/submit', {
                    name: name,
                    email: email
                });
                
                // Show success message
                showMessage('Student saved successfully!', 'success');
                
                // Clear form
                document.getElementById('studentForm').reset();
                
            } catch (error) {
                // Show error message
                showMessage('Error saving student!', 'error');
            }
        });
        
        
        // Function to load and display students
        async function loadStudents() {
            try {
                const response = await axios.get('http://localhost:3000/students');
                const students = response.data;
                
                const studentsList = document.getElementById('studentsList');
                
                if (students.length === 0) {
                    studentsList.innerHTML = '<p>No students registered yet.</p>';
                } else {
                    studentsList.innerHTML = students.map(student => 
                        `<div class="student-item">
                            <strong>${student.name}</strong> - ${student.email}
                         </div>`
                    ).join('');
                }
            } catch (error) {
                showMessage('Error loading students!', 'error');
            }
        }