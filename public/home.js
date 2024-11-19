//deletes user from the database
document.getElementById('delete').addEventListener('click', async (event) => {
    try {
        const username = prompt('Confirm Username:'); // Get username from the user
        if (!username) {
            alert('Username is required to delete a user.');
            return;
        }

        const response = await fetch('http://localhost:3000/deleteUser', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }), // Send username in request body
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message); // Display success message
            window.location.href = '/index.html'; // Redirect to login page
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`); // Display error message
        }
    } catch (err) {
        console.error(err.message);
        alert('Error occurred while deleting');
    }
});

//responsible for the navigation bar
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.querySelector(".openbtn").style.display = "none";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.querySelector(".openbtn").style.display = "block";
}


//looks for username from the session or local storage
document.querySelector('a[href="#"]').addEventListener('click', function() {
    var username = getUsernameFromSession(); 
    document.getElementById("main").innerHTML = `<button class="openbtn" onclick="openNav()">&#9776;</button><h1>Welcome, ${username}</h1>`;
    document.getElementById("profile").style.display = "none";
    document.getElementById("main").style.display = "block";
});

function getUsernameFromSession() {
    // Assuming the username is stored in session storage
    return sessionStorage.getItem('username') || 'User'; // Fallback username
}

//Putting deleting user button under profile
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("profile").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("profile").style.marginLeft= "0";
}

document.querySelector('a[href="#profile"]').addEventListener('click', function() {
    document.getElementById("profile").style.display = "block";
    document.getElementById("main").style.display = "none";
    document.getElementById("Delete").style.display = "block";
});

//signout button
document.getElementById('logout').addEventListener('click', function() {
    window.location.href = '/index.html';
});
