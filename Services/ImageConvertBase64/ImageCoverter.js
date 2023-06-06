const fs =require('fs')

exports.base64_encode=(file)=>{
    return fs.readFileSync(file.filename, { encoding: 'base64' });
}