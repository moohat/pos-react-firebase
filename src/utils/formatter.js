import numeral from 'numeral';


//rupiah / indonesia (id)

// load a locale
numeral.register('locale', 'id', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'rb',
        million: 'jt',
        billion: 'm',
        trillion: 't'
    },
    ordinal : function (number) {
        return number === 1 ? 'er' : 'ème';
    },
    currency: {
        symbol: 'Rp'
    }
});

// switch between locales
numeral.locale('id');

//export currency
 export const currency = (number)=>{  // => data diimport menggunakan variable object eq. import {currency} from 'formatter'
    return numeral(number).format('$0,0');
}
// export default currency; //=> di import nya sebagai variable biasa eq. import currency from 'formatter'