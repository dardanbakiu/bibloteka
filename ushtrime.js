let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;

const dataMarrjes = today

if (mm == 12) {
    mm = 1
    yyyy = parseInt(yyyy) + 1
}
else {
    mm = parseInt(mm) + 1
}
dataKthimit = dd + '/' + mm + '/' + yyyy;

console.log(dataMarrjes, dataKthimit)