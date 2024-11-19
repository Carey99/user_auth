document.getElementById('userform').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {

        const response  = await fetch('http://localhost:4000/userCreation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            window.location.href = '/home.html';
        } else {
            alert('Error occurred');
        }

    } catch (err) {
        console.error(err.message);
        alert('An error occurred while saving');
    }
});


document.getElementById('sign_in').addEventListener('click', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:4000/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError.message);
            alert('Server responded with non-JSON data');
            return;
        }

        if (response.ok) {
            alert(result.message);
            window.location.href = '/home.html';
        } else {
            alert(result.message || 'Error occurred');
        }
    } catch (err) {
        console.error('Fetch Error:', err.message);
        alert('An error occurred while processing the request');
    }
});