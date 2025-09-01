async function fetchUsers() {
    const res = await fetch('/admin/admin/users');
    const data = await res.json();
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    data.users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.is_active ? 'Yes' : 'No'}</td>
                <td>${new Date(user.created_at).toLocaleString()}</td>
                <td class="actions">
                    <button onclick='editUser(${JSON.stringify(user)})'>Edit</button>
                    <button onclick='deleteUser(${user.id})'>Delete</button>
                </td>
            </tr>
        `;
    });
}

async function deleteUser(id) {
    if (confirm("Delete this user?")) {
        await fetch(`/admin/admin/users/${id}`, { method: 'DELETE' });
        fetchUsers();
    }
}

function showCreateForm() {
    document.getElementById('formTitle').innerText = "Create User";
    const form = document.getElementById('userForm');
    form.reset();
    form.querySelector('input[name="id"]').value = '';
    form.querySelector('input[name="password"]').required = true;
    document.getElementById('formContainer').style.display = 'block';
}

function editUser(user) {
    document.getElementById('formTitle').innerText = "Edit User";
    const form = document.getElementById('userForm');
    form.querySelector('input[name="id"]').value = user.id;
    form.querySelector('input[name="name"]').value = user.name;
    form.querySelector('input[name="email"]').value = user.email;
    form.querySelector('input[name="is_active"]').checked = user.is_active;
    form.querySelector('input[name="password"]').value = '';
    form.querySelector('input[name="password"]').required = false;
    document.getElementById('formContainer').style.display = 'block';
}

function hideForm() {
    document.getElementById('formContainer').style.display = 'none';
}

document.getElementById('userForm').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
        name: form.querySelector('input[name="name"]').value,
        email: form.querySelector('input[name="email"]').value,
        is_active: form.querySelector('input[name="is_active"]').checked
    };

    const password = form.querySelector('input[name="password"]').value;
    if (password) data.password = password;

    const id = form.querySelector('input[name="id"]').value;
    if (id) {
        await fetch(`/admin/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } else {
        await fetch('/admin/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    hideForm();
    fetchUsers();
};

fetchUsers();
