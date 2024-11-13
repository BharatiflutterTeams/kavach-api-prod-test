const buildProdLogger = require("./prod-logger");
const buildDevLogger = require("./dev-logger");


let logger=null;
if(process.env.NODE_ENV === 'development'){
    logger=buildDevLogger();

}else{
    logger=buildProdLogger();
}
module.exports=logger;