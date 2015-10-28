var SqlMapClient = function(namespace)
{
	this.namespace = namespace;
};

SqlMapClient.prototype.selectQuery = function(id, param, callback)
{
	global._immy.selectOne(this.namespace, id, param, callback);
};

SqlMapClient.prototype.selectsQuery = function(id, param, callback)
{
	global._immy.select(this.namespace, id, param, callback);
};

SqlMapClient.prototype.insertQuery = function(id, param, callback)
{
	global._immy.insert(this.namespace, id, param, callback);
};

SqlMapClient.prototype.updateQuery = function(id, param, callback)
{
	global._immy.update(this.namespace, id, param, callback);
};

SqlMapClient.prototype.deleteQuery = function(id, param, callback)
{
	global._immy.remove(this.namespace, id, param, callback);
};

module.exports = SqlMapClient;