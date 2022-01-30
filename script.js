const form = document.querySelector('#todoForm');
const input = document.querySelector('#todoInput');
const output = document.querySelector('#output');

let todos = [];

const fetchTodos = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos')
  const data = await res.json()
  todos = data;
  listTodos();
}

fetchTodos();


const listTodos = () => {
  output.innerHTML = ''
  const todos10 = todos.slice(0, 10);
  todos10.forEach(todo => {
    output.appendChild(createTodoElement(todo))
  })
} //add function show all todos, button


const createTodoElement = todo => {

  let card = document.createElement('div');
  card.classList.add('todo');

  let title = document.createElement('p');
  title.classList.add('todo-title');
  title.innerText = todo.title

  let btnDiv = document.createElement('div');
  btnDiv.classList.add('btn-div')

  let button = document.createElement('button');
  button.classList.add('btn', 'btn-remove');
  button.innerText = 'X';

  let textDone = document.createElement('p');
  textDone.classList.add('todo-done');

  let btnDone = document.createElement('button');
  btnDone.classList.add('btn', 'btn-done');
  if (todo.completed === false) {
    btnDone.innerText = 'Done';
  }
  else {
    btnDone.innerText = 'Undo';
    textDone.innerText = 'Task done! Move to done-list?'
    title.classList.add('txt-done')
  }

  card.appendChild(title);
  card.appendChild(btnDiv);
  btnDiv.appendChild(button);
  btnDiv.appendChild(btnDone);
  title.insertAdjacentElement('beforeend', textDone);
  
  button.addEventListener('click', () => removeTodo(todo.id, todo.completed, card))
  
  btnDone.addEventListener('click', e => {
    if (btnDone.innerText === 'Done') {
      updateTodo(todo.id, todo.title, true, card);
      btnDone.innerText = 'Undo'
    }
    else {
      updateTodo(todo.id, todo.title, false, card);
      btnDone.innerText = 'Done'
      textDone.innerText = ''
      title.classList.remove('txt-done')
      console.log('test undone/done')
    }
  })
  
  return card;
}


function updateTodo (id, title, completed, todo) {
  console.log('updating: ' +id);

  todos = todos.filter(todo => todo.id !== id) //need to fix, to keep position in todolist 
  listTodos()
  
  fetch('https://jsonplaceholder.typicode.com/todos/' + id, {
    method: 'PATCH',
    body: JSON.stringify({
        title,
        completed
      }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
  })
  .then(res => res.json())
  .then(data => {
    // console.log(data)
    todos.unshift(data); //need to fix, to keep position in todolist 
    listTodos()
    // console.log(todos)
  })
}


function removeTodo(id, completed, todo) {

  if (completed === true) {
  todos = todos.filter(todo => todo.id !== id)
  listTodos()

  fetch('https://jsonplaceholder.typicode.com/todos/' + id, {
  method: 'DELETE',
  });
  console.log('removing: ' +id);
  }
  else {
    console.log('No delete executed, todo must be completed: ' +id);
  // add message to user, todo must be completed before remove from todolist
  }
}


const createNewTodo = title => {
  fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    body: JSON.stringify({
        title,
        completed: false
      }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
  })
  .then(res => res.json())
  .then(data => {
    console.log(data)
    todos.unshift(data);
    listTodos()
  })
}


form.addEventListener('submit', e => {
  e.preventDefault();
  if(input.value !== '') {
    input.classList.remove('is-invalid');
    
    createNewTodo(input.value);
    input.value = '';
    input.focus()
  }
  else {
    input.classList.add('is-invalid');
  }
})