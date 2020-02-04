'use strict';

const util = require('util');
const log = require('debug')('services:readxml');
const request = require('request');

const readXml = async xmlArr => {
    const urlArr = await readXmlArr(xmlArr);
    const flatUrlArr = urlArr.flat(Infinity);
    const filteredArr = flatUrlArr.filter(url => url.slice(-3) === 'xml');
    if (filteredArr.length > 0) {
        const newUrlArr = await readXml(filteredArr)
        const returnArr = flatUrlArr.filter(url => url.slice(-3) !== 'xml').concat(newUrlArr);
        return returnArr;
    }
    else {
        return flatUrlArr; 
    }
}

const readXmlArr = xmlUrlArr => {
    return Promise.all(
        xmlUrlArr.map(url => {
            const arr = requestXml(url);
            return arr;
        })
    );
}

const requestXml = url => {
    return new Promise( async (resolve, reject) => {
        request(url, {encoding: null}, (err, res, body) => {
            if (err) reject(err);           
            const space = /\s+/;
            const bodyStr = body.toString()
            const xmlArr = bodyStr.split(space);
            const filteredXmlArr = xmlArr.filter(xmlElement => xmlElement.slice(-6) === '</loc>')
            const urlArr = filteredXmlArr.map(xmlElement => xmlElement.slice(5, xmlElement.length - 6))
            resolve(urlArr);    
        });
    })
};

module.exports = readXml;
