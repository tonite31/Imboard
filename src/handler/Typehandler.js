module.exports.BlobTypeHandler = function(value)
{
	return value != null ? value.toString() : "";
};