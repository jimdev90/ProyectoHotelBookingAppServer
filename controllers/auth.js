
import User from "../models/user";
import jwt from 'jsonwebtoken'


export const login = () => {


}

export const register = async  (req, res) => {
    console.log(req.body);

    const {name, email, password} = req.body
    // validación
    if (!name) return res.status(400).send('Nombre es requerido')
    if (!password || password.length < 6)
        return res
            .status(400)
            .send('Password es requerido y debe de contener al menos 6 caracteres')

    let userExist = await User.findOne({email: email}).exec()
    if (userExist) return res.status(400).send("El email ya existe")

    // Registramos

    const user = new User(req.body)
    try {
        await user.save()
        console.log('USER CREATER ', user)
        return res.json({ok: true})
    } catch (err) {
        console.log('ERROR AL CREAR USUARIO '.err)
        return res.status(400).send('Error. Vuelva a intentarlo')
    }

}


