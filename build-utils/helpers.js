
const path = require('path');

/**
 * @param {string} folderPath - folder's path
 * @return {string}
 */
exports.setupPath = (folderPath) => path.resolve(__dirname, `${folderPath}`);
