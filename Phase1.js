
module.exports = (json) => {
    Data = json.elements[0].elements[0].elements;

    let classes = Data.filter(rec => {
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
         obj['class'] = f;
         obj['fields'] = Data.filter(r => {
            return r.attributes.parent == f.attributes.id;
         });
    
         return obj;
    });
    
    let relationships = Data.filter(rec => {
        if (rec.attributes.hasOwnProperty('parent'))
        {
            return rec.attributes.parent == 1;
        }
        return false;
    }).filter(p => {
        return p.attributes.hasOwnProperty('edge');
    });
    
    return {
        classes,
        relationships
    }
}



