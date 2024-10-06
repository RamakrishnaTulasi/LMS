document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/Courses')
        .then(response => response.json())
        .then(data => {
            const courseList = document.getElementById('courseList');
            data.forEach(course => {
                const courseItem = document.createElement('div');
                courseItem.classList.add('course-item');
                courseItem.innerHTML = `
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <button onclick="openModal('${course.id}', '${course.title}', '${course.topic}')">Purchase</button>
                `;
                courseList.appendChild(courseItem);
            });
        })
        .catch(error => console.error('Error fetching courses:', error));
});

function openModal(courseId, title, topic) {
    document.getElementById('courseTitle').textContent = title;
    document.getElementById('courseTopic').textContent = topic;
    document.getElementById('topicModal').style.display = 'block';
}

document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const userData = {
        userId: document.getElementById('userId').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        enrollmentDate: document.getElementById('enrollmentDate').value,
        role: document.getElementById('role').value
    };

    fetch('/api/enroll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Enrollment successful!');
                closeModal();
            } else {
                alert('Error enrolling user.');
            }
        })
        .catch(error => console.error('Error submitting form:', error));
});

function closeModal() {
    document.getElementById('topicModal').style.display = 'none';
}
