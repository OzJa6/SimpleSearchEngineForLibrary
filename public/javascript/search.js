async function post () {
    let response = await fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify()
    })
    return response.json()
}

document.addEventListener('DOMContentLoaded', () => {
    // setTimeout(() => {
    //     post();
    // }, 5000); 
    //post();
})