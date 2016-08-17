const pokemonAPI = require('pokemon');
const fs = require('fs');
const langs = ['de', 'ja', 'ru', 'fr'];
const exceptions = {
  'Nidoran♀': 'nidoranf',
  'Nidoran♂': 'nidoranm',
  'Mr. Mime': 'mrmime'
};

// read the english files content only once.
const yamlWithoutPrefix = fs.readFileSync('./pokemon.yaml').toString();
const yamlWithPrefix = fs.readFileSync('./pokemon-prefix.yaml').toString();
let translatedYamlWithoutPrefix;
let translatedYamlWithPrefix;
let fileWithoutPrefix;
let fileWithPrefix;

langs.forEach((lang) => {
  // create directory
  if (!fs.existsSync(`./translations/${lang}`)) fs.mkdirSync(`./translations/${lang}`);
  // init the output yaml
  translatedYamlWithoutPrefix = yamlWithoutPrefix;
  translatedYamlWithPrefix = yamlWithPrefix;

  fileWithoutPrefix = `./translations/${lang}/pokemon.${lang}.yaml`;
  fileWithPrefix = `./translations/${lang}/pokemon-prefix.${lang}.yaml`;

  // only translate the 151 first pokemons
  for (let index = 1; index < 152; index++) {
    let englishName = pokemonAPI.getName(index);
    let translatedName = pokemonAPI.getName(index, lang).toLowerCase();
    if (!englishName || !translatedName) console.warn('Unknown pokemon!!!');
    // check for registered exceptions
    if (exceptions.hasOwnProperty(englishName)) {
      console.log('Found pokemon name exception', englishName, exceptions[englishName]);
      englishName = exceptions[englishName];
    }
    englishName = englishName.toLowerCase();
    translatedName = translatedName.toLowerCase();
    translatedYamlWithoutPrefix = translatedYamlWithoutPrefix.replace(englishName, translatedName);
    translatedYamlWithPrefix = translatedYamlWithPrefix.replace(englishName, translatedName);
  }
  fs.writeFileSync(fileWithoutPrefix, translatedYamlWithoutPrefix);
  fs.writeFileSync(fileWithPrefix, translatedYamlWithPrefix);
});
