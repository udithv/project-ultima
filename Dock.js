const fse = require('fs-extra');
const Mustache = require('mustache');

class Dock {
    constructor(uid, mid){
        this.uid = uid;
        this.mid = mid;
        this.prefix = 'schdock-';
        this.udir = `/tmp/${this.prefix}${this.uid}-${this.mid}`;
        this.mdir = `/tmp/${this.prefix}${this.uid}-${this.mid}/models/`;
        this.files = [];

    }

    get userDir(){
        return this.udir;
    }

    get modelDir(){
        return this.mdir;
    }

    get fpathList(){
        return this.fpathlist;
    }

    /*
     * Generates the source code from view using mustache template install 
     * Input : { path: string, jsview: Object }
     * Output: { path: string, content: string }
     */

    genModelData(mobj){
        return fse.readFile('./template/Model.mustache')
                .then(tdata => tdata.toString())
                .then(tdata =>  {
                    let obj = {};
                    obj['path'] = mobj.path;
                    obj['content'] = Mustache.render(tdata,mobj.jsview)
                    return obj;
                });
    }

    /* 
     * Deletes the user directory used for cleaning up afterwards.
     * 
     */
    cleanUpUserDir(){
       return fse.remove(this.udir)
                    .then(() => {
                        return {
                            success:true,
                            userDir:this.udir
                        }
                    })
                    .catch(err => {
                        console.error(err)
                        return { 
                            success: false
                        }
                    });
    }

    /* 
     *Creates a folder with name prefix-userid-modelid
     */

    createTmpModelsFolder(){
       return fse.ensureDir(this.mdir)
                    .then(() => {
                        console.log('Model folder for user created', this.mdir);
                        return {
                            success: true,
                            modelDir: this.mdir
                        };
                    })
                    .catch(err => {
                        console.error(err);
                        return {
                            success: false
                        };
                    });
        
    }

    /* 
     * Geneartes Files view array from the template
     */

    genFileViews(models){
        return models.map(model => {
            let mobj = {};
            mobj['path'] = `${this.mdir}${model.cname}.js`;
            mobj['filename'] = `${model.cname}.js`;
            mobj['jsview'] = model;
            return mobj;
        });

    }

    /* 
     *Returns a promise which resolves an array of 
     */
    getFileMetadata(models){
        return Promise.all(
            this.genFileViews(models).map(f => this.genModelData(f))
        );
    }

    /* 
     *Returns a promise that resolves to boolean if successful the modelsDir
     */
    genModelFiles(models){
        return this.getFileMetadata(models)
                .then(files => {
                    this.files = files;
                    let fwparr = files.map(file => {
                        return fse.writeFile(file.path, file.content);
                    });

                    return this.createTmpModelsFolder()
                                .then(res => {
                                    return Promise.all(fwparr);
                                });

                });
    }

    
}


const Dock1 = new Dock('hello','world');

let fileList = ['User.js', 'Model.js','dock.js'];

let models = [
    {
        cname: "User",
        schemaname: function(){
            return this.cname+'Schema';
        }
    },
    {
        cname: "Blog",
        schemaname: function(){
            return this.cname+'Schema';
        }
    }
];

/* Dock1.genModelFiles(models)
      .then(() => console.log('success'));
 */
    
 Dock1.cleanUpUserDir();