class getItemFilter {
    #_query;
    #_queryString;
  
    constructor(query, queryString) {
      this.#_query = query;
      this.#_queryString = queryString;
    }
  
    filter() {
      let queryStr = { ...this.#_queryString };
      const excludedQueries = ["limit", "page", "sort", "fields"];
  
      excludedQueries.map((efl) => delete queryStr[efl]);

      queryStr = JSON.parse(JSON.stringify(queryStr).replace(/\b(lt|lte|gt|gte)\b/g,(match) => `$${match}`)
      );
  
      this.#_query = this.#_query.find(queryStr);
  
      return this;
    }
  
    paginate(defaultLimit = 10) {
      const limit = this.#_queryString?.limit || defaultLimit;
      const offset = this.#_queryString?.page
        ? (this.#_queryString.page - 1) * limit
        : 0;
  
      this.#_query = this.#_query.limit(limit).skip(offset);
  
      return this;
    }
  
    sort(defaultSortField) {
      if (this.#_queryString.sort) {
        const sortFields = this.#_queryString.sort.split(",").join(" ");
        this.#_query = this.#_query.sort(sortFields);
      } else {
        this.#_query = this.#_query.sort(defaultSortField);
      }
  
      return this;
    }
  
    limitFields() {
      if (this.#_queryString?.fields) {
        const selectedFields = this.#_queryString.fields.split(",").join(" ");
        this.#_query = this.#_query.select(selectedFields);
      }
  
      return this;
    }
  
    getQuery() {
      return this.#_query;
    }
  }
  
  export default getItemFilter;
  