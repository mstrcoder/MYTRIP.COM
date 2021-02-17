    // we need a hard copy of that object to do this we do strucutring becoz if we do not do this then it will be normally referece of the onject

    // console.log(find);

    // FIELD LIMITATION
    // if (req.query.fields) {
    //   console.log("hello");
    //   const fields = req.query.fields.split(",").join(" ");
    //   console.log(fields);
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }
    // // console.log(query);

    // //PAGINATION

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error("This Page Not Exist");
    // }

    // console.log(req.query);

class API{
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
    filter() {
      // console.log(this.queryString);
      //Filtering
    
      const queryObj = {...this.queryString};
  
      // console.log("hello1",queryObj);
  
  
      const exclude = ['fields','page', 'sort', 'limit'];
      exclude.forEach((el) => {
        // console.log(el); 
        delete queryObj[el]
      });
      // console.log(req.query);
      // const find1=await Tour.find(req.query);
      // console.log(find1);
      // console.log('hello 2 '  ,queryObj);
      //Advanced Filtering like adding GTE and LTE with $ sign
      let queryStr = JSON.stringify(queryObj);
      quertStr = queryStr.replace(/\bgte|gt|lte|lt\b/g, (match) => {
        `$${match}`;
      });
      // console.log("hello3");
      // console.log(this.queryString);
      // console.log(JSON.parse(queryStr));
  
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
      
    }
    sorting() {
      //SORTING
      console.log(this.queryString);
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join(" ");
        console.log(sortBy);
        this.query = this.query.sort(sortBy);
  
        //sort('price raitngAverage)
      } else {
        this.query = this.query.sort("-createdAt");
      }
      return this;
    }
    fields() {
      // FIELD LIMITATION
      if (this.queryString.fields) {
        // console.log("hello");
        const fields = this.queryString.fields.split(",").join(" ");
        // console.log(fields);
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v");
      }
      return this;
    }
    pagination() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
      // if (this.queryString.page) {
      //   const numTours = await this.query.countDocuments();
      //   if (skip >= numTours) throw new Error("This Page Not Exist");
      // }
    }
  }

  module.exports =API