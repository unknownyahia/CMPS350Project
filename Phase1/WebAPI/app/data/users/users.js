import fs from "node:fs/promises";

class Users {
  constructor() {
    this.directoryJsonData = "app/data/users/users.json";
  }

  async save(updated) {
    await fs.writeFile(this.directoryJsonData, JSON.stringify(updated));
  }

  async getAll() {
    const jsonData = await fs.readFile(this.directoryJsonData, "utf-8");
    const all = JSON.parse(jsonData);
    return all;
  }

  async getUserById(id) {
    const users = await this.getAll();
    return users.find((user) => +user.id === +id);
  }

  async updateUser(user) {
    const users = await this.getAll();
    const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
    await this.saveUsers(updatedUsers);
  }

  async getUserByUsernamePassword(username, password) {
    const users = await this.getAll();
    return users.find(
      (user) => user.username === username && user.password === password
    );
  }
}

const users = new Users();
export default users;
