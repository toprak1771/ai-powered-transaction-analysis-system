export type Transaction = {
    description:string;
    amount:number;
    date:string;
}

export type ResultPatternDetection = {
    merchant:string;
    amount:number;
    type:string;
    frequency:string;
    confidence:number;
    next_excepted?:string;
    detail?:string;
}