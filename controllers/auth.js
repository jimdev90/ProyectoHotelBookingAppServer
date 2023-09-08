
import User from "../models/user";
import jwt from 'jsonwebtoken';


export const login = async (req, res) => {

    const {email, password} = req.body;
    try {
        // Verificamos si el usuario existe
        let user = await User.findOne({email: email}).exec();
        if (!user) res.status(400).send('El email ingresado no se encuentra registrado');

        // comparamos la contraseña
        user.comparePassword(password, (err, match) => {

            if (!match || err) return res.status(400).send('Password incorrecto');
            // GENERAR UN TOKEN LUEGO ENVIAR COMO RESPUESTA AL CLIENTE
            let token = jwt.sign({_id: user.id}, process.env.JWT_SECRET, {
                expiresIn: '7d'
            });

            res.json({
                token : token,
                user: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            });

        });

    } catch (err) {
        console.log('LOGIN ERROR ', err)
        res.status(400).send('Inicio de sesión fallida');
    }

}

export const register = async  (req, res) => {
    console.log(req.body);

    const {name, email, password} = req.body;
    // validación
    if (!name) return res.status(400).send('Nombre es requerido');
    if (!password || password.length < 6)
        return res
            .status(400)
            .send('Password es requerido y debe de contener al menos 6 caracteres');

    let userExist = await User.findOne({email: email}).exec();
    if (userExist) return res.status(400).send("El email ya existe");

    // Registramos

    const user = new User(req.body);
    try {
        await user.save();
        console.log('USER CREATER ', user);
        return res.json({ok: true});
    } catch (err) {
        console.log('ERROR AL CREAR USUARIO '.err);
        return res.status(400).send('Error. Vuelva a intentarlo');
    }

}


