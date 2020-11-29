
class Search {
  constructor(data = []) {
    this.data = data;
    this.indices = {};
    this.createPhraseIndices();
  }

  // create all possible tokens from the word
  // eslint-disable-next-line class-methods-use-this
  createTokens(str) {
    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < str.length; i++) {
      // eslint-disable-next-line no-plusplus
      for (let j = i + 1; j < str.length + 1; j++) {
        result.push(str.slice(i, j));
      }
    }
    // filter token having length greter than 3
    return result.filter(token => token.length > 3);
  }

  // create token and store it in this.indices with there indexes
  createPhraseIndices() {
    this.data.forEach((detail, index) => {
      const fullName = `${detail.fname} ${detail.lname}`;
      const words = fullName.toLowerCase().split(' ');
      words.forEach((word, wordIndex) => {
        this.createWordIndices(word, index, wordIndex);
      });
    });
  }

  createWordIndices(word, index) {
    const characters = this.createTokens(word);
    characters.forEach((character) => {
      if (!this.indices[character]) {
        this.indices[character] = { ids: [], counter: 0 };
      }
      this.indices[character].ids.push(index);
      this.indices[character].ids = Array.from(new Set(this.indices[character].ids));
      // eslint-disable-next-line no-plusplus
      this.indices[character].counter++;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  query(query) {
    // split query data into words from space
    const words = query.toLowerCase().split(' ').map(word => word.trim());
    if (words.length === 0) return [];
    let results = [];
    words.forEach((word) => {
      // create all possible token from word
      const characters = this.createTokens(word);
      characters.forEach((character) => {
        // find all result indexes which are already stored in this.indices
        const wordIndice = this.indices[character] || { ids: [] };
        results = [...results, ...wordIndice.ids];
        // remove duplicate results
        results = Array.from(new Set(results));
      });
    });
    if (results.length === 0) return [];
    const details = [];
    // get all result document and assingn scores based on results
    results.forEach((key, index) => {
      details[index] = this.data[key];
      // eslint-disable-next-line no-underscore-dangle
      let _score = 1;
      Object.values(details[index]).forEach((value) => {
        // increment score if document starts with query data
        words.forEach((detail) => {
          if ((typeof value === 'string') && value.toLowerCase().startsWith(detail.toLowerCase())) {
            // eslint-disable-next-line no-underscore-dangle
            _score += 1;
          }
        });
      });
      // eslint-disable-next-line no-underscore-dangle
      details[index]._score = _score;
    });
    // sort result based on score
    // eslint-disable-next-line no-underscore-dangle
    return details.sort((current, next) => (next._score - current._score));
  }
}

module.exports = Search;
