
import bcrypt from "bcrypt"
import { userDao } from "../dao/user.dao.js"
import { createToken, updateLastConnection } from "../utils/jwt.js";

export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await userDao.getByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "El nombre de usuario ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userDao.create({
            username,
            password: hashedPassword,
        });

        const userSaved = await newUser.save()

        const token = await createToken({ id: userSaved._id })
        res.cookie("token", token)
        res.json({
            id: userSaved._id,
            username: userSaved.username
        })
    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario" });
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userFound = await userDao.getByUsername(username);
        if (!userFound) {
            return res.status(400).json({ message: "Nombre de usuario o contraseña incorrectos" });
        }

        const isMatch = await bcrypt.compare(password, userFound.password)

        if (!isMatch) return res.status(400).json({ message: "Contraseña inválida." })

        const token = await createToken({ id: userFound._id });

        res.cookie("token", token)

        res.json({
            id: userFound._id,
            username: userFound.username
        })
        
        updateLastConnection(req.user._id)

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0)
    })
    return res.sendStatus(200)
}

export const profile = async (req, res) => {
    const userFound = await userDao.getById(req.user.id);

    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado." })

    return res.json({
        id: userFound._id,
        username: userFound.username
    })
}