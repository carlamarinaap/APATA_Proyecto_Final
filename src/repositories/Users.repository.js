import UsersDTOPOST from "../dao/dto/usersPOST.dto.js";
import UsersDTOGET from "../dao/dto/usersGET.dto.js";

export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  get = async () => {
    const allUsers = await this.dao.getUsers();
    const users = allUsers.map((user) => {
      return new UsersDTOGET(user);
    });
    return users;
  };

  getById = async (id) => {
    return await this.dao.getUserById(id);
  };

  getByEmail = async (email) => {
    return await this.dao.getUserByEmail(email);
  };

  getByCreds = async (email, password) => {
    return await this.dao.getUserByCreds(email, password);
  };

  add = async (user) => {
    const newUser = new UsersDTOPOST(user);
    return await this.dao.addUser(newUser);
  };

  updatePassword = async (email, password) => {
    this.dao.updatePassword(email, password);
  };
  updateRole = async (email) => {
    this.dao.updateRole(email);
  };

  delete = async (id) => {
    this.dao.deleteUser(id);
  };
}
