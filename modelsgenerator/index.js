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
            fields: c.fields.map((f, index, fieldarr) => {
                let { fieldname, type } = f;
                return {
                    name: fieldname,
                    type,
                    iscomma: ((index == (fieldarr.length - 1)) && ((c.ones.length == 0) && (c.manys.length == 0))) ? false : true
                }
            }),
            ones: c.ones.map((o, index, onesarr) => {
                return {
                    name: o,
                    singular: o.toLowerCase(),
                    iscomma: ((index == (onesarr.length - 1)) && (c.manys.length == 0)) ? false : true
                }
            }),
            manys: c.manys.map((m, index, manysarr) => {
                return {
                    name: m,
                    plural: m.toLowerCase().concat('s'),
                    iscomma: (index == (manysarr.length - 1)) ? false : true
                }
            })
        }
    });
}