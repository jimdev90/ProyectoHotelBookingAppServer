import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const {Schema} = mongoose

const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: 'Nombre es requerido'
        },
        email: {
            type: String,
            trim: true,
            required: 'Email es requerido',
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 64
        },
        stripe_account_id: '',
        stripe_seller: {},
        stripeSession: {}

    },
    {timestamps: true}
)

/**
 * Al guardar el usuario, debemos asegurarnos de que la contraseña esté codificada, no una contraseña simple
 * el hashing debe hacerse solo en 2 situaciones
 * 1. si es la primera vez que se guarda/crea un usuario
 * 2. el usuario ha actualizado/modificado la contraseña existente
 * para manejar dichos requisitos, podemos usar middleware 'pre' en nuestro esquema
 * este middleware/función se ejecutará cada vez que se guarde/cree un usuario
 * y/o se modifica/actualiza la contraseña
 */

userSchema.pre('save', function (next) {
    let user = this
    // contraseña hash solo si el usuario está cambiando la contraseña o registrándose por primera vez
    // asegúrese de usar esto de otra manera cada vez que se ejecute user.save(), la contraseña
    // se actualizará automáticamente y no podrá iniciar sesión con la contraseña original
    if (user.isModified('password')){
        return bcrypt.hash(user.password, 12, function (err, hash){
            if (err){
                console.log('BCRYPT HASH ERR ', err)
                return next(err)
            }

            user.password = hash
            return next()
        })
    }else{
        return next()
    }
})

userSchema.methods.comparePassword = function (password, next){
    bcrypt.compare(password, this.password, function (err, match) {
        if (err){
            console.log('COMPARE PASSWORD ERR ', err)
            return next(err, false)
        }

        // if no err, we get null
        console.log('MATH PASSWORD ', match)
        return next(null, match) // true

    })
}

export default mongoose.model('User', userSchema)