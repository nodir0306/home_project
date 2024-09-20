import { MainException } from "./main.exception.js";

export class BadRequestsErr extends MainException{
    constructor(message){
        super();
        this.statusCode = 400;
        this.name = "Bad requests";
        this.message = message;
    }
}

export class  NotFoundErr extends MainException{
    constructor(message){
        super();
        this.statusCode = 404;
        this.name = "Not Found";
        this.message = message;
    }
}


export class TokenExpiredException extends MainException {
  constructor(message) {
    super();
    this.statusCode = 499;
    this.name = "Token Expired Exception";
    this.message = message;
  }
}

export class ConflictException extends MainException {
    constructor(message) {
      super();
      this.statusCode = 409;
      this.name = "Conflict Exception";
      this.message = message;
    }
  }