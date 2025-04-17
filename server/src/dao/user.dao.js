
import { userModel } from "../models/User.js";

class UserDao {
    async getAll() {
        const users = await userModel.find()
        return users;
    }

    async getById(id) {
        const user = await userModel.findById(id);
        return user;
    }

    async create(data) {
        const user = await userModel.create(data);
        return user;
    }

    async update(id, data) {
        const userUpdate = await userModel.findByIdAndUpdate(id, data, {
            new: true,
        });
        return userUpdate;
    }

    async deleteOne(id) {
        const user = await userModel.deleteOne({ _id: id });
        return user;
    }

    async getByUsername(username) {
        const user = await userModel.findOne({ username });
        return user;
    }
}

export const userDao = new UserDao();