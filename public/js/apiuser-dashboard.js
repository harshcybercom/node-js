async function fetchApiUsers() {
    const res = await fetch('/apiuser/users');
    const data = await res.json();
    const tbody = document.querySelector('#apiUsersTable tbody');
    tbody.innerHTML = '';
    data.users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${new Date(user.createdAt).toLocaleString()}</td>
                <td class="actions">
                    <button onclick='editApiUser(${JSON.stringify(user)})'>Edit</button>
                    <button onclick='deleteApiUser(${user.id})'>Delete</button>
                </td>
            </tr>
        `;
    });
}

async function deleteApiUser(id) {
    if (confirm("Delete this API user?")) {
        await fetch(`/apiuser/users/${id}`, { method: 'DELETE' });
        fetchApiUsers();
    }
}

function showCreateForm() {
    document.getElementById('formTitle').innerText = "Create API User";
    const form = document.getElementById('apiUserForm');
    form.reset();
    form.querySelector('input[name="id"]').value = '';
    form.querySelector('input[name="password"]').required = true;
    document.getElementById('formContainer').style.display = 'block';
}

function editApiUser(user) {
    document.getElementById('formTitle').innerText = "Edit API User";
    const form = document.getElementById('apiUserForm');
    form.querySelector('input[name="id"]').value = user.id;
    form.querySelector('input[name="name"]').value = user.name;
    form.querySelector('input[name="email"]').value = user.email;
    form.querySelector('input[name="password"]').value = '';
    form.querySelector('input[name="password"]').required = false;
    document.getElementById('formContainer').style.display = 'block';
}

function hideForm() {
    document.getElementById('formContainer').style.display = 'none';
}

document.getElementById('apiUserForm').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
        name: form.querySelector('input[name="name"]').value,
        email: form.querySelector('input[name="email"]').value
    };

    const password = form.querySelector('input[name="password"]').value;
    if (password) data.password = password;

    const id = form.querySelector('input[name="id"]').value;
    if (id) {
        await fetch(`/apiuser/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } else {
        await fetch('/apiuser/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    hideForm();
    fetchApiUsers();
};

fetchApiUsers();
