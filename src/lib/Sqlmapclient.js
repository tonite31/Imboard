var SqlMapClient = function(namespace)
{
	this.namespace = namespace;
};

SqlMapClient.prototype.selectQuery = function(id, param, callback)
{
	global.sqlMapConfig.selecioneUm(this.namespace + "." + id, param, callback);
};

SqlMapClient.prototype.selectsQuery = function(id, param, callback)
{
	global.sqlMapConfig.selecioneVarios(this.namespace + "." + id, param, callback);
};

SqlMapClient.prototype.insertQuery = function(id, param, callback)
{
	global.sqlMapConfig.insira(this.namespace + "." + id, param, callback);
};

SqlMapClient.prototype.updateQuery = function(id, param, callback)
{
	global.sqlMapConfig.atualize(this.namespace + "." + id, param, callback);
};

SqlMapClient.prototype.deleteQuery = function(id, param, callback)
{
	global.sqlMapConfig.remova(this.namespace + "." + id, param, callback);
};

module.exports = SqlMapClient;