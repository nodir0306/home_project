export class MainException extends Error{
    constructor(){
        super();
        this.isException = true;
    }
}