/*jslint node: true */
var ROL_ADMIN = 'Administrador';
var ROL_COLABORADOR = 'Colaborador';
var MSG_NO_AUTENTICADO = "Se requiere de autenticación para utilizar los servicios del Cupitaller";
var allow = {
	ALL: function(req, res, next) {
		if (!req.isAuthenticated())
			return authFail(next, MSG_NO_AUTENTICADO);
		else
			return next();
	},
	COL: function(req, res, next) {
		if (!req.isAuthenticated())
			return authFail(next, MSG_NO_AUTENTICADO);
		if(hasRol(req.user, ROL_COLABORADOR))
			return next();
		else
			return authFail(next,"Se requiere ser colaborador para realizar la acción que ha solicitado.");
	},
	ADM: function(req, res, next) {
		if (!req.isAuthenticated())
			return authFail(next, MSG_NO_AUTENTICADO);
		if(hasRol(req.user, ROL_ADMIN))
			return next();
		else
			return authFail(next,"Se requiere ser administrador para realizar la acción que ha solicitado.");
	}
};

function authFail (next, message){
	var err = new Error(message);
	err.status = 401;
	return next(err);
}

function hasRol(user, rol) {
	if (!user)
		return false;

	var roles = user.roles;
	console.log("ROLES: ", roles.length);
	for (var i = 0; i < roles.length; i++) {
		if (roles[i].Nombre === rol) {
			return true;
		}
	}
	return false;
}


module.exports = allow;
