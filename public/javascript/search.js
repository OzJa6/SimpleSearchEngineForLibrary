async function post () {
    let response = await fetch('/search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        //body: JSON.stringify()
    })
    return response.json()
}

document.addEventListener('DOMContentLoaded', () => {
    // setTimeout(async () => {
    //     await post();
    // }, 5000); 
    post();
})