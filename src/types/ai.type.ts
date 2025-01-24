export type Transaction = {
    description:string;
    amount:number;
    date:string;
}

export type ResultPatternDetection = {
    merchant:string;
    type:string;
    frequency:string;
    confidence:number;
    next_excepted?:string;
}