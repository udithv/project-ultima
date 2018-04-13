const fse = require('fs-extra');

class Dock {
    constructor(uid, mid){
        this.uid = uid;
        this.mid = mid;
        this.prefix = 'schdock-';
        this.udir = `/tmp/${this.prefix}${this.uid}-${this.mid}`;
        this.mdir = `/tmp/${this.prefix}${this.uid}-${this.mid}/models`;
        this.fpathlist = [];
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

    cleanUpUserDir(){
        fse.remove(this.udir)
            .then(() => {
                console.log(`CleanUp Complete for ${this.udir}`);
            })
            .catch(err => {
                console.error(err)
            });
    }

    createTmpModelsFolder(){

        fse.ensureDir(this.mdir)
          .then(() => {
              console.log('Model folder for user created');
              return;
          })
          .catch(err => {
              console.error(err)
          });
        
        return modelDir;
        
    }

    populateModelsDir(flist){
        const fpathlist = flist.map(fname => {
            return `${this.mdir}/${fname}`;
        });

        this.fpathlist = fpathlist;
    
        return Promise.all(fpathlist.map(fpath => {
            return fse.outputFile(fpath)
        }));
        
    }
}


const Dock1 = new Dock('hello','world');

let fileList = ['User.js', 'Model.js','dock.js'];


    