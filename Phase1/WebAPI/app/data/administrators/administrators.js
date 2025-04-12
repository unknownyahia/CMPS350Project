import fs from "node:fs/promises";
import users from "../users/users.js";
class Administrators {
  constructor() {
    this.directoryJsonData = "app/data/administrators/administrators.json";
  }

  async save(updated) {
    await fs.writeFile(this.directoryJsonData, JSON.stringify(updated));
  }

  async getAll() {
    const jsonData = await fs.readFile(this.directoryJsonData, "utf-8");
    const all = JSON.parse(jsonData);
    return all;
  }

  async getAdministratorById(id) {
    const administrators = await this.getAll();
    return administrators.find((administrator) => +administrator.id === +id);
  }
  async getAdministratorByUserId(id) {
    const administrators = await this.getAll();
    return administrators.find((administrator) => +administrator.userId === +id);
  }

  async getAdministratorData(id) {
    const administrators = await this.getAll();
    const administrator = administrators.find((admin) => +admin.id === +id);
    const user = await users.getUserById(administrator.userId);
    return { ...administrator, name: user.name };
  }

  async updateAdministrator(administrator) {
    const administrators = await this.getAll();
    const updatedAdministrators = administrators.map((a) =>
      a.id === administrator.id ? administrator : a
    );
    await this.save(updatedAdministrators);
  }
}

const administrators = new Administrators();
export default administrators;
