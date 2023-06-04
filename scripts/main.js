// --- do not touch  ↓↓↓↓↓↓↓↓↓↓↓↓ ----------
const baseServerURL = `http://localhost:${
  import.meta.env.REACT_APP_JSON_SERVER_PORT
}`;
// --- do not touch  ↑↑↑↑↑↑↑↑↑↑↑↑ ----------

const recipeIngredientURL = `${baseServerURL}/recipeIngredients`;
const employeeURL = `${baseServerURL}/employees`;
const userRegisterURL = `${baseServerURL}/user/register`;
const userLoginURL = `${baseServerURL}/user/login`;
let paginationWrapper = document.getElementById("pagination-wrapper");

let loginUserUsername = document.getElementById("login-user-username");
let loginUserPassword = document.getElementById("login-user-passowrd");

let loginUserButton = document.getElementById("login-user");
let getTodoButton = document.getElementById("fetch-todos");

let mainSection = document.getElementById("data-list-wrapper");
let notificationWrapper = document.getElementById("notifications-wrapper");

let userAuthToken = localStorage.getItem("localAccessToken") || null;
let userId = +localStorage.getItem("userId") || null;
const urlAllTodosOfUser = `${baseServerURL}/todos?userId=${userId}`;
const urlTodosBase = `${baseServerURL}/todos/`;


loginUserButton.addEventListener("click", ()=>{
  userAuth()
})

function userAuth(){
  let userobj = {
     username : loginUserUsername.value,
     password : loginUserPassword.value
  }
  fetch(userLoginURL,{
    method:"POST",
    headers:{
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userobj) 
  })
  .then((data)=>{
    return data.json()
  })
  .then((data)=>{
    console.log(data)
    userAuthToken = data.accessToken;
    localStorage.setItem("localAccessToken", JSON.stringify(data.accessToken))
    userId = data.user.id;
    localStorage.setItem( "userId", JSON.stringify(data.user.id))
    todolist(userId,userAuthToken)
    notification(data.user.username)
  })
}

//-------------
function notification(username){
  notificationWrapper.innerHTML = ""
  notificationWrapper.innerHTML = 
  `<h5 class= "notification info">
     hey ${username}, welcome back!
   </h5>`
}

//------------
function todolist(userId, accessToken){
  
  getTodoButton.addEventListener("click", ()=>{
    console.log("raj")
    fetch(`${baseServerURL}/todos?userId=${userId}`,{
      headers:{
        "Authorization": `Bearer ${accessToken}`  
      }
    })
    .then((res)=>{
      console.log(res)
      return res.json()
    })
    .then((data)=>{
      console.log(data)
      todolistBody(data)
    })
  })
}

//----------
function todolistBody(data){
  //mainSection.innerHTML = "";
  let todowrapper = document.createElement("div");
  todowrapper.classList.add("todo-list-wrapper")
  todowrapper.setAttribute("id","todo-list-wrapper")

  data.forEach(element => {
    let label = document.createElement("label")
    label.textContent = element.title;

    let inp = document.createElement("input")
    inp.classList.add("todo-item-checkbox")
    inp.setAttribute("data-id", element.id)
    inp.setAttribute("type", "checkbox")
    if(element.completed==true){
       inp.setAttribute("checked", "")
    }

    inp.addEventListener("change", ()=>{
       if(element.completed==false){
         element.completed= true
       }else{
        element.completed=false;
       }
       togglebox(element)
    })

    label.append(inp)
    todowrapper.append(label)
   });
  mainSection.append(todowrapper)
}

//-----------

function togglebox(element){
  
  let obj = {
    id: element.id,
    title: element.title,
    completed: element.completed
  }
  console.log(obj)
  
  let token = JSON.parse(localStorage.getItem("localAccessToken"))
  let userId = JSON.parse(localStorage.getItem("userId"))

  fetch(`${baseServerURL}/todos/${userId}`,{
    method:"PATCH",
    headers:{
      "Authorization": `Bearer ${token}`,  
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
  .then((res)=>{
    console.log(res)
    return res.json()
  })
  .then((data)=>{
    console.log(data)
  })  
}