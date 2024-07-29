
const todoContainer = document.getElementById("todos");
const Todo_text = document.getElementById("input_text");


document.addEventListener('DOMContentLoaded', loadTodos);

//*****POST*****//

function Add_todo() {

  const todoValue = Todo_text.value;
  const new_todo = document.createElement("div");
  new_todo.classList.add("todo_item") ; 

  //POST İŞLEMİ

  fetch('http://127.0.0.1:3000',{

    method:'POST',
    headers:{
        'Content-Type': 'application/json'
    },
    body:JSON.stringify({ todo : todoValue})
  })
  .then(response => response.json())
  .then(data => {
     loadTodos();
  })
  .catch(error => console.error('Error:', error));

}

//*****DELETE*****/

const Delete_todo = (todo_Id) => {

fetch(`http://127.0.0.1:3000/${todo_Id}`,{

    method: "DELETE"

  })
  .then((res) => {
      const todoItem = document.getElementById(todo_Id);
      todoItem.remove()
  })
  .catch(error => {
    console.error('Error:',error)
  });
}

//*****PUT*****//

const Edit_todo = (todo_Id) => {

  const todo_text_container = document.getElementById(`text_${todo_Id}`);
  const edit_container = document.createElement("div");
  edit_container.classList.add("edit_container");
    
  const input = document.createElement("input");
  input.type= "text";
  
  const save_button = document.createElement("button");
  save_button.textContent = "Save";
  
  edit_container.appendChild(input);
  edit_container.appendChild(save_button);

  //text div yerine edit_container gelmesi
  const todo_item = todo_text_container.parentElement;
  todo_item.insertBefore(edit_container,todo_text_container);
  todo_text_container.style.display = "none";

  //todo_item deki buttonların kaldırılması
  const edit_button = todo_item.querySelector(".edit");
  const delete_button = todo_item.querySelector(".delete");
  edit_button.style.display = "none";
  delete_button.style.display = "none";

  //PUT İŞLEMİ 

  save_button.onclick = () =>{
  const update_todo = input.value;

  fetch(`http://127.0.0.1:3000/${todo_Id}`, {

    method: "PUT",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ todo: update_todo })
  })
  .then(response => response.json())
  .then(() => {
    todo_text_container.textContent = update_todo; 
    todo_text_container.style.display = ""; 
    edit_button.style.display = "";
    delete_button.style.display= "";
    edit_container.remove();
  })
  .catch(error => console.error("Error:", error));
  };
}

function loadTodos(){
  
fetch('http://127.0.0.1:3000')
.then(response => response.json())
.then (data => {
  todoContainer.innerHTML="";
  data.forEach(todo =>{
    const new_todo = document.createElement("div");
    new_todo.classList.add("todo_item");
    new_todo.id=todo.id;
    new_todo.innerHTML = `
        <div id="text_${todo.id}" class="text">${todo.todo}</div>
        <button class="edit" onclick="Edit_todo('${todo.id}')">✎</button>
        <button class="delete" onclick="Delete_todo('${todo.id}')">🗑️</button>
    `;
    todoContainer.appendChild(new_todo);
    Todo_text.value = "";
  })
})
.catch(error => console.error('Error:',error));
}
