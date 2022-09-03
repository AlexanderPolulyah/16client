const server = 'http://localhost:8000/api/';

function addCellText(row, text){
    let item = document.createElement('td')
    item.innerHTML = text;
    row.appendChild(item);
}
function getButton(text, onclick){
    let item = document.createElement('button')
    item.innerText = text
    item.onclick = onclick
    return item
}
function addCellButtons(row, text, onclick, text2, onclick2){
    let item = document.createElement('td')
    item.appendChild(getButton(text, onclick))
    item.appendChild(getButton(text2, onclick2))
    row.appendChild(item);
}
function showUsers(users){
    const idTable = document.querySelector('#idTable');
    for(let user of users.data){
        let row = document.createElement('tr');
        idTable.appendChild(row);

        addCellText(row, user.name)
        addCellText(row, user.email)        
        addCellButtons(row, '...', ()=>{
            localStorage.idUser = user.id
            location.href="editUser.html"
        },
        'X', ()=>deleteUser(user.id))
    }
}
function showUser(data){
    if(data.message !== 'success'){
        document.querySelector('#idError').innerText = 'Ошибка выборки данных по пользователю';
        return;
    }    
    let user = data.data;
    document.querySelector('#id').value = user.id;
    document.querySelector('#name').value = user.name;    
    document.querySelector('#email').value = user.email;
}
async function getUsers(){
    await fetch(server + 'users')
    .then(data=>data.json())
    .then(data=>showUsers(data))
}
async function getUser(){
    await fetch(server + 'user/' + localStorage.idUser)
    .then(data=>data.json())
    .then(data=>showUser(data))
}
async function saveUser(id){//для insert id=undefined, для update id передавать
    let user = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
    };
    await fetch(`${server}user${id ? `/${id}` : ''}`, {
        method: id ? 'PATCH' : 'post',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(data => {
        if(data.message === 'success'){
            location.href="index.html"
        }else{
            document.querySelector('#idError').innerText = 'Ошибка сохранения!'  
        }
    })
}
async function deleteUser(id){
    await fetch(`${server}user/${id}`, {method: 'delete'})
    .then(data=>data.json())
    .then(data => {
        if(data.message === 'deleted'){
            location.href="index.html"
        }else{
            document.querySelector('#idError').innerText = 'Ошибка удаления!';
        }
    })
}
