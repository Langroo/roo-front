const langNameGetter = (toSearch) => {
  let languageName;
  const availableLanguages = {
    afrikaans: {
      lang_code: 'af',
    },
    albanian: {
      lang_code: 'sq',
    },
    arabic: {
      lang_code: 'ar',
    },
    azerbaijani: {
      lang_code: 'az',
    },
    basque: {
      lang_code: 'eu',
    },
    bengali: {
      lang_code: 'bn',
    },
    belarusian: {
      lang_code: 'be',
    },
    bulgarian: {
      lang_code: 'bg',
    },
    catalan: {
      lang_code: 'ca',
    },
    chinese: {
      lang_code: 'zh-CN',
    },
    'chinese simplified': {
      lang_code: 'zh-CN',
    },
    'chinese traditional': {
      lang_code: 'zh-TW',
    },
    croatian: {
      lang_code: 'hr',
    },
    czech: {
      lang_code: 'cs',
    },
    danish: {
      lang_code: 'da',
    },
    dutch: {
      lang_code: 'nl',
    },
    english: {
      lang_code: 'en',
    },
    esperanto: {
      lang_code: 'eo',
    },
    estonian: {
      lang_code: 'et',
    },
    filipino: {
      lang_code: 'tl',
    },
    finnish: {
      lang_code: 'fi',
    },
    french: {
      lang_code: 'fr',
    },
    galician: {
      lang_code: 'gl',
    },
    georgian: {
      lang_code: 'ka',
    },
    german: {
      lang_code: 'de',
    },
    greek: {
      lang_code: 'el',
    },
    gujarati: {
      lang_code: 'gu',
    },
    'haitian creole': {
      lang_code: 'ht',
    },
    hebrew: {
      lang_code: 'iw',
    },
    hindi: {
      lang_code: 'hi',
    },
    hungarian: {
      lang_code: 'hu',
    },
    icelandic: {
      lang_code: 'is',
    },
    indonesian: {
      lang_code: 'id',
    },
    irish: {
      lang_code: 'ga',
    },
    italian: {
      lang_code: 'it',
    },
    japanese: {
      lang_code: 'ja',
    },
    kannada: {
      lang_code: 'kn',
    },
    korean: {
      lang_code: 'ko',
    },
    latin: {
      lang_code: 'la',
    },
    latvian: {
      lang_code: 'lv',
    },
    lithuanian: {
      lang_code: 'lt',
    },
    macedonian: {
      lang_code: 'mk',
    },
    malay: {
      lang_code: 'ms',
    },
    maltese: {
      lang_code: 'mt',
    },
    norwegian: {
      lang_code: 'no',
    },
    persian: {
      lang_code: 'fa',
    },
    polish: {
      lang_code: 'pl',
    },
    portuguese: {
      lang_code: 'pt',
    },
    romanian: {
      lang_code: 'ro',
    },
    russian: {
      lang_code: 'ru',
    },
    serbian: {
      lang_code: 'sr',
    },
    slovak: {
      lang_code: 'sk',
    },
    slovenian: {
      lang_code: 'sl',
    },
    spanish: {
      lang_code: 'es',
    },
    swahili: {
      lang_code: 'sw',
    },
    swedish: {
      lang_code: 'sv',
    },
    tamil: {
      lang_code: 'ta',
    },
    telugu: {
      lang_code: 'te',
    },
    thai: {
      lang_code: 'th',
    },
    turkish: {
      lang_code: 'tr',
    },
    ukrainian: {
      lang_code: 'uk',
    },
    urdu: {
      lang_code: 'ur',
    },
    vietnamese: {
      lang_code: 'vi',
    },
    welsh: {
      lang_code: 'cy',
    },
    yiddish: {
      lang_code: 'yi',
    },
  };

  let key;
  for (key in availableLanguages) {
    if (availableLanguages[key].lang_code.indexOf(toSearch) > -1) {
      languageName = key;
    }
  }

  return languageName;
};

module.exports = langNameGetter;
