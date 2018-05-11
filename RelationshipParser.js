const preprocessor = require('./preprocessor');

module.exports = (json) => {
    let { classes, relationships } = preprocessor(json);
    return {
        classes: classes.map(c => {
            let rels = relationships.filter(x => {
                return c.idarr.includes(x.source);
            });
        
            let relt = relationships.filter(x => {
                return c.idarr.includes(x.target);
            });
            
            
            return {
                ...c,
                ones: rels.filter(r => {
                    return r.endArrow == 'none';
                }).map(r => {
                    return classes.filter(cl => {
                                return cl.idarr.includes(r.target);
                                }).map(oc => oc.classname)[0];
                }).concat(relt.filter(r => {
                    return r.startArrow == 'none';
                }).map(r => {
                    return classes.filter(cl => {
                        return cl.idarr.includes(r.source);
                        }).map(oc => oc.classname)[0];
                })),
                manys: rels.filter(r => {
                    return r.endArrow == 'ERmany';
                }).map(r => {
                    return classes.filter(cl => {
                                return cl.idarr.includes(r.target);
                                }).map(oc => oc.classname)[0];
                }).concat(relt.filter(r => {
                    return r.startArrow == 'ERmany';
                }).map(r => {
                    return classes.filter(cl => {
                        return cl.idarr.includes(r.source);
                        }).map(oc => oc.classname)[0];
                }))
            }
        }),
        relationships
    }

}