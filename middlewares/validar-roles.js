const { request, response } = require("express")


const esAdminRole = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quire verificar el rol sin validar token primero'
        })
    }

    const {rol, name} = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} no es administrador - No puede hacer eso`
        })
    }

    next();
}

const tieneRol = (...roles) => {

    

    return (req = request, res = response, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio require uno de estos roles ${roles}`
            })
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRol
}