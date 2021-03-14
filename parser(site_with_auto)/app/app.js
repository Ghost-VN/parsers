const cheerio = require('cheerio'),
      chalk = require('chalk'),
      {slugify} = require('transliteration'),
      common = require('./helpers/common'),
      {getPageContent} = require('./helpers/puppeteer'),
      {saveData} = require('./handlers/saver');

const SITE = ``; // some site
const pages = 5;

String.prototype.extract = function(prefix, secondPrefix, suffix, secondSuffix) {
    s = this;
    var i = s.indexOf(prefix || secondPrefix);
    if (i >= 0) {
        s = prefix ? s.substring(i + prefix.length ) : s.substring(i + secondPrefix);
    }
    else {
        return '';
    }
    if (suffix || secondSuffix) {
        i = suffix ? s.indexOf(suffix) : s.indexOf(secondSuffix);
        if (i >= 0) {
            s = s.substring(0, i);
        }
        else {
            return '';
        }
    }
    return s;
};

(async function main(){

  let paramObj = {};

  try {
        for (const page of common.arrFromLength(pages)){
            const url = `${SITE}/ukr/oldcars/?task=newresults&start=${page}`;
            const pageContent = await getPageContent(url);

            const $ = cheerio.load(pageContent);
            const carsItems = [];

            $('.rst-ocb-i-a').each((i, header) => {
                const url = $(header).attr('href');
                const title = $(header).text(),
                      titleFormatted =  title.replace('продам ', '');

                carsItems.push({
                    title: titleFormatted,
                    url: `${SITE}${url}`,
                    code: slugify(titleFormatted)
                })
            });

            $('.rst-ocb-i-d-l').each(function(i, elm) {
                const str = $(this).text();
                paramObj = {
                    price: str.extract('Цiна: ', '', 'Місто', 'Область'),
                    city: str.extract('Місто: ', 'Область: ','Рiк', 'Рiк'),
                    mileage: str.extract(' (', '', ' - пробiг', ''),
                    engine: str.extract('Двиг.: ', '','', ''),
                    state: str.extract('Стан: ', '','Двиг.', '')
                };
            });
            carsItems.forEach(item => {
                Object.assign(item, paramObj)
            })

            console.log('page ---> ', page)
            await saveData(page, carsItems);
            //console.log(carsItems);
        }
  } catch (e){
      console.log(chalk.red(`Error has occured`));
      console.error(`ERROR ---> `, e);
  }
})();
