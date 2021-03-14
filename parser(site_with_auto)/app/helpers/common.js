const arrFromLength = (number) =>
    Array.from(new Array(number).keys()).map(k => k+1)
;

module.exports = {
    arrFromLength
};
