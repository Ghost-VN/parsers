const path = require('path'),
      fs = require('fs'),
      chalk = require('chalk');

const saveData = async (page, data) => {
    const fileName = `page_${page}.json`;
    const savePath = path.join(__dirname, '../..', 'data', fileName);

    return new Promise((resolve, reject) => {
        fs.writeFile(savePath, JSON.stringify(data, null, 4), e => {
            if(e){
                return reject(e);
            }
            console.log(`${chalk.blue('Success saving')} ${chalk.blue.bold(fileName)} \n`);
            resolve();
        })
    })
};

module.exports = {
    saveData
};
