/**
 * ModelsGenerator => RelationshipParser => preprocessor
 * Generates models object of the form:
 * [
    {
        cname: String,
        schemaname: String,
        fields: Array { name: String,type: String }
        ones: Array of strings
        manys: Array of strings
    }
    ];
 * 
 */
const RelationshipParser = require('./RelationshipParser');

module.exports = (json) => {

    return RelationshipParser(json).classes.map(c => {
        return {
            cname: c.classname,
            schemaname: c.classname+'Schema',
            fields: c.fields.map(f => {
                let { fieldname, type } = f;
                return {
                    name: fieldname,
                    type
                }
            }),
            ones: c.ones,
            manys: c.manys
        }
    });
}