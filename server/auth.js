import { getUsers, saveUsers } from "./mockDB.js"

export function loginUser(login, password) {
  const users = getUsers();
  const user = users.find(u => u.login === login && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, error: 'Неверный логин или пароль' };
}

export function registerUser(login, password, name) {
  const users = getUsers();
  if (users.find(u => u.login === login)) {
    return { success: false, error: 'Пользователь с таким логином уже существует' };
  }
  const newUser = { id: users.length + 1, login, password, name, role: 'user' };
  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

export function logoutUser() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

export function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}
