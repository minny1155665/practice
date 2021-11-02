import {franc, francAll} from 'franc'
//import process from 'process'
import langs from 'langs'
import colors from 'colors'

const input = process.argv[2];
const langCode = franc(input);
const lang = langs.where('3', langCode);
try {
    console.log(colors.green(lang.name));
} catch {
    console.log(colors.yellow("Undefined or too short. Please try again!"));
}
