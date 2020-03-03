'use strict';

const util = require('util');
const log = require('../services/log.service')('services:readxml');
const gunzipArrs = require('../services/gzip.service');
const request = require('request');

const readXml = async xmlArr => {
    const urlArr = await readXmlArr(xmlArr);
    const flatUrlArr = urlArr.flat(Infinity);
    const gunzippedUrlArr = await gunzipArrs(flatUrlArr);
    const flatGunzippedUrlArr = gunzippedUrlArr.flat(Infinity);
    const filteredXmlArr = flatGunzippedUrlArr.filter(url => url.slice(-3) === 'xml');
    if (filteredXmlArr.length > 0) {
        const newUrlArr = await readXml(filteredXmlArr);
        const returnArr = flatGunzippedUrlArr.filter(url => url.slice(-3) !== 'xml').concat(newUrlArr);
        return returnArr;
    }
    else {
        return flatGunzippedUrlArr; 
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
