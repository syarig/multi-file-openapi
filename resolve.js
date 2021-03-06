#!/usr/bin/env node

'use strict'

const JsonRefs = require('json-refs');
const YAML = require('js-yaml');
const fs = require('fs');
const program = require('commander');

/**
 * @param {String} path 
 * @param {String} data 
 * @throws {Exception}
 */
function writeFile(path, data) {
    fs.writeFile(path, data, function (err) {
        if (err) {
            throw err;
        }
    });
}

/**
 * Resolve $ref in yaml files and write file
 * 
 * @param {String} entryPoint 
 * @param {String} output 
 * @throws {Exception}
 */
function resolve(entryPoint, output) {
    try {
        const root = YAML.safeLoad(fs.readFileSync(entryPoint).toString());
        const options = {
            filter: ['relative', 'remote'],
            loaderOptions: {
                processContent: function (res, callback) {
                    callback(null, YAML.safeLoad(res.text));
                }
            }
        };

        JsonRefs.resolveRefs(root, options).then(function (results) {
            writeFile(output, YAML.safeDump(results.resolved));
        });
        JsonRefs.clearCache();

    } catch (err) {
        console.log('Failed to resolve', err);
    }
}

program
    .version('0.0.1')
    .option('-e, --entry-point [yaml]', 'Entry point YAML', /.*.yaml$/i, './openapi/index.yaml')
    .option('-o --output [yaml]', 'Output YAML', /.*.yaml$/i, 'openapi.yaml')
    .parse(process.argv);

resolve(program.entryPoint, program.output);
console.log('YAML file resolve completed');