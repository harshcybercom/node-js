// Function to refresh the page after operations
function refreshPage() {
    window.location.reload();
}

async function deleteApiUser(id) {
    if (confirm("Delete this API user?")) {
        await fetch(`/apiuser/users/${id}`, { method: 'DELETE' });
        refreshPage();
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
    form.querySelector('select[name="is_active"]').value = user.is_active;
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
        email: form.querySelector('input[name="email"]').value,
        is_active: form.querySelector('select[name="is_active"]').value
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
    refreshPage();
};
