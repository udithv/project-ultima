
module.exports = (json) => {
    Data = json.elements[0].elements[0].elements;
     
    return {
        classes: Data.filter(rec => {
            if (rec.attributes.hasOwnProperty('parent'))
            {
                return rec.attributes.parent == 1;
            }
            return false;
        }).filter(p => {
            return !p.attributes.hasOwnProperty('edge');
        }).map(f => {
             let obj = {};
             obj['classname'] = f.attributes.value;
             obj['classid'] = f.attributes.id;
             obj['fields'] = Data.filter(r => {
                return r.attributes.parent == f.attributes.id;
             });
        
             return obj;
        }).map(c => {
            let { classname, classid } = c;
            let arr = [];
            arr.push(classid);
            return{
                classname,
                classid,
                fields: c.fields.map(f => {
                    let { id, value, parent } = f.attributes;
                    let field = value.replace(/[^\w:]/g, "").match(/((\w)*):((\w)*)/i);
                    return {
                        id,
                        parent,
                        fieldname: field[1],
                        type: field[3]
                    };
                }),
                idarr: arr.concat(c.fields.map(x => x.attributes.id))
            }
        }),
        relationships: Data.filter(rec => {
            if (rec.attributes.hasOwnProperty('parent'))
            {
                return rec.attributes.parent == 1;
            }
            return false;
        }).filter(p => {
            return p.attributes.hasOwnProperty('edge');
        }).map(e => {
            let {edge, parent } = e.attributes;
            if(e.attributes.hasOwnProperty('edge') && edge && (parent == 1) ){
                let { id, style, source, target } = e.attributes;
                let sre = /startArrow=((\w)*);/i;
                let ere = /endArrow=((\w)*);/i;
                let startArrow = style.match(sre) ? style.match(sre)[1] : 'none';
                let endArrow = style.match(ere) ? style.match(ere)[1] : 'none';
                
                return {
                    eid: id,
                    startArrow,
                    endArrow,
                    source,
                    target
                }
            }
        })
    }
}



