'use strict'

const az = require('az');
const createError = require('http-errors');
const fs = require('fs');

const searchModel = require('./searchModel');


const pattern1 = /[А-Яа-я]{1,15}-$/
const pattern2 = /[A-Za-zА-Яа-я]{1,15}-[0-9]{1,5}$/

module.exports.getSearch = async (req, res, next) => {
    try {
        res.render('./search/views/search.pug', {
            title: 'Поиск'
        })
    }
    catch (err) {
        next(err);
    }
}

module.exports.getUpload = async (req, res, next) => {
    try {
        res.render('./search/views/uploadFile.pug', {
            title: 'Поиск'
        })
    }
    catch (err) {
        next(err);
    }
}
/*
todo: полностью переработать:
        - проверка объектов на наличие всех нужных полей(заглавие, айдишник, автор, год издания)
        - сначала встравка записей в бд:
                1) проверить наличие такой записи(по айдишнику, но мб по всем полям)
                2) если записи нет - вставить ее
        - если запись есть в бд, но нет в файле - удалить из бд
        - строим индекс:
                1) если слово есть то вместо add - update
                2) если слова нет в новом индексе, но есть в старом - удалить

*/


module.exports.postCreateIndex = async (req, res) => {
    try {
        let recordsArray = await prepareRecords("QUICKR_INFO_202302171551.json");
        let invertedIndex = await createInvertedIndexArray(recordsArray);

        recordsArray.map((obj) => {
            searchModel.add('Records', obj);
        });
        invertedIndex.map((obj) => {
            searchModel.add('InvertedIndex', obj);
        });

        res.status(200).json({ status: 'ok' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'bad' });
    }
}

module.exports.postSearch = async (req, res, next) => {
    try {
        let query = await new Promise((resolve, reject) => {
            try {
                az.Morph.init(async () => {
                    resolve(await extractWords(req.body, 'keywords'));
                })
            } catch (error) {
                reject(error);
            }
        })

        let recordsIds = await searchModel.getIds('InvertedIndex', query.keywords);
        let data = formatingRecords(await searchModel.getRecords('Records', (await countAndSortIdsIncludes(recordsIds)).map(id => id.id)));
        
        res.status(200).json(await sortRecords(recordsIds,data));
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'bad' });
    }
}

/**писать сложную сортировку с учетом положения ключевого слова в строке запроса и последовательности слов лень
 * подсчитывает количество повторений id книги в выборке и сортирует полученный массив пар {id: кол-во} по убыванию количества
 * @param {array} ids список id для каждого ключевого слова
 * @returns массив объектов вида {id: количество повторений в выборке} отсортированный по убыванию количества повторений
 */
async function countAndSortIdsIncludes(ids) {

    let fullIds = (ids.map((record) => { return record.recordsIds })).flat();

    let names = {};
    fullIds.forEach(item => {
        names[item] = (names[item] || 0) + 1;
    });

    let recordsIdscount = [];
    for (let id in names) {
        recordsIdscount.push({ id: id, count: names[id] });
    }

    recordsIdscount.sort((a, b) => {
        if (a.count > b.count)
            return -1;
        if (a.count < b.count)
            return 1;
        return 0;
    })

    return recordsIdscount.map(id => { return { id: parseInt(id.id) } });
}
/**
 * сортировка полученный записей в нужном порядке
 * @param {array} ids массив idшников записей
 * @param {array} data непосредственнос сами записи
 * @returns отсортированный массив data
 */
function sortRecords(ids, data) {
    return new Promise(async (resolve, reject) => {
        try {
            let orderArray = await countAndSortIdsIncludes(ids);
            let orderObj = orderArray.reduce((a, c, i) => { a[c.id] = i; return a; }, {});
            data.sort((l, r) => orderObj[l.RECORD_ID] - orderObj[r.RECORD_ID]);

            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}
//todo перенести на уровень работы с бд
/**
 * возвращаем только нужные поля
 * @param {array} recordsArray массив записей
 * @returns массив с элементами содержащими только нужные поля
 */
function formatingRecords(recordsArray) {
    return recordsArray.map((record) => {
        return {
            RECORD_ID: record.RECORD_ID,
            NUM_OF_BOOKS: record.NUM_OF_BOOKS,
            WEB_FACE_OF_BOOK: record.WEB_FACE_OF_BOOK
        }
    })
}
//todo добавить загрузчик на сайт
/**
 * загрузка записей из файла
 * @param {string} path путь до json файла с записями
 * @returns массив записей, описывающих книги
 */
async function readJson(path) {
    let fileContent = fs.readFileSync(path, 'utf-8')
    let json = await JSON.parse(fileContent)
    return Object.values(json)[0];
}

/**
 * Обертка в промис колбека для az.morph
 * @param {object} objToExtract - объект с полями TITLE и AUTHORS, слова в которых будут разделены и нормализованы(приведены в начальную форму)
 * @returns Promise: resolve нормализованный объект
 */
function extractWords(objToExtract, property) {
    return new Promise((resolve, reject) => {
        try {
            var wordsArray = new Array();

            let tokens = az.Tokens(objToExtract[property]).done(['SPACE', 'PUNCT'], true)

            for (let i = 0; i < tokens.length; i++) {
                //обработка ошибок ввода типа "планово- экономический" вместо "планово-экономический"
                if (pattern1.test(tokens[i].toString()) && i < tokens.length - 2) {
                    tokens.splice(i, 2, tokens[i].toString() + tokens[i + 1].toString())
                }
                //обработка маркоровок типа "Т. 5" (том пятый)
                if (tokens[i].toString() == 'Т' && tokens[i + 1].type == az.Tokens.NUMBER) {
                    tokens.splice(i, 2, 'Том ' + tokens[i + 1].toString())
                }
            }

            tokens.map((token) => {

                if (az.Morph(token.toString())[0] != undefined)
                    wordsArray.push(az.Morph(token.toString())[0].normalize(true).word)
                else
                    //обработка нечитаемых аббревиатур с числами (ваз-2107, Olimp-80)
                    if (pattern2.test(token.toString())) {
                        wordsArray.push(token.toString())
                    }
            })
            objToExtract[property] = wordsArray;
            resolve(objToExtract)

        }
        catch (err) {
            reject(err)
        }
    })

}

/**
 * форматирование записей для построения индекса
 * @param {string} path путь до json файла с записями
 * @returns массив распаршенных записей со словами в начальной форме
 */
function prepareRecords(path) {
    return new Promise(async (resolve, reject) => {
        try {
            let chunkArray = await readJson(path);
            az.Morph.init(async () => {
                const chunkArrayPromises = chunkArray.map((record) => extractWords(record, 'TITLE'))
                const resolvedapromises = await Promise.all(chunkArrayPromises)
                resolve(resolvedapromises);
            })
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * построение инвертированного индекса
 * @param {array} recordsArray 
 * @returns Promise: resolve массив, содержащий объекты формата:
 * {
 *  word: word,
 *  count: 1,
 *  recordsIds: [record.RECORD_ID]
 * }
 */

function createInvertedIndexArray(recordsArray) {
    return new Promise((resolve, reject) => {
        try {
            let index = new Array();

            recordsArray.map((record) => {
                record.TITLE.map((word) => {
                    let position = index.findIndex(obj => obj.word === word)
                    if (position != -1) {
                        if (!index[position].recordsIds.includes(record.RECORD_ID)) {
                            index[position].count++;
                            index[position].recordsIds.push(record.RECORD_ID);
                        }
                    }
                    else {
                        index.push(
                            {
                                word: word,
                                count: 1,
                                recordsIds: [record.RECORD_ID]
                            });
                    }
                })
            })
            resolve(index);
        } catch (error) {
            reject(error);
        }
    })

}
