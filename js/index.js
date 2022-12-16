// Declare global variables
nameSubmit = true;

// Build DOM interface variables
const form = document.querySelector('form');
const submit = document.getElementById('submit');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');
const reset = document.getElementById('reset');

// Set event listeners
form.addEventListener('submit', e => search(e));
reset.addEventListener('click', e => resetPage(e));

// Function to reset page
function resetPage() {
  userList.replaceChildren();
  reposList.replaceChildren();
  reset.hidden = true;
  nameSubmit = true;
  submit.value = 'Search Users'
}

// Function to submit user-provided name for search
function search(e) {
  e.preventDefault();
  if (nameSubmit) {
    resetPage();
    fetch(`https://api.github.com/search/users?q=${e.target.search.value}`, {
      Headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    })
    .then(resp => resp.json())
    .then(json => publishNames(json));
  } else {
    reposList.replaceChildren();
    fetch(`https://api.github.com/search/repositories?q=${e.target.search.value}`, {
      Headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    })
    .then(resp => resp.json())
    .then(json => addData(json.items));
  }
  reset.hidden = false;
  form.reset();
}

// Function to cycle through all names returned by search
function publishNames(names) {
  for (person of names.items) {
    addPerson(person);
  }
}

// Function to add a new person to the DOM
function addPerson(object) {
  let newLi = document.createElement('li');
  let newPicDiv = document.createElement('div');
  let newImage = document.createElement('img');
  newImage.src = object.avatar_url;
  let newNameDiv = document.createElement('div');
  let newLink = document.createElement('a');
  newLink.href = object.html_url;
  newLink.textContent = object.login;
  let newButtonDiv = document.createElement('div');
  let newButton = document.createElement('button');
  newButton = formatButton(newButton, object.login);
  newButtonDiv.appendChild(newButton);
  newNameDiv.appendChild(newLink);
  newPicDiv.appendChild(newImage);
  newLi.appendChild(newPicDiv);
  newLi.appendChild(newNameDiv);
  newLi.appendChild(newButtonDiv);
  userList.appendChild(newLi);
}

// Sets up the more info button
function formatButton(btn, obj) {
  btn.textContent = 'Show all Repos';
  btn.addEventListener('click', e => {
    nameSubmit = false;
    submit.value = 'Search Repos';
    fetch(`https://api.github.com/users/${obj}/repos`, {
      Headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    })
    .then(resp => resp.json())
    .then(json => addData(json));
  })
  return btn;
}

// Cycles through Repos for provided user
function addData(object) {
  for (repo of object) {
    addRepo(repo);
  }
}

// Adds the additional data requested about the user
function addRepo(repo) {
  let newLi = document.createElement('li');
  let newLink = document.createElement('a');
  newLink.href = repo.html_url;
  newLink.textContent = repo.name;
  newLi.appendChild(newLink);
  reposList.appendChild(newLi);
}

// Prints data
function printData(input) {
  console.log(input);
}