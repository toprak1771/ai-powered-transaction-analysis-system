import {IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateNormalizationDto {
    @IsNotEmpty()
    @IsString()
    description:string;

    @IsNotEmpty()
    @IsNumber()
    amount:number;

    @IsNotEmpty()
    @IsString()
    date:string;
}


export class CreateNormalizationServices {
    @IsString()
    description:string;

    @IsString()
    merchant:string;

    @IsString()
    category:string;

    @IsString()
    sub_category:string;

    @IsNumber()
    confidence:number;

    @IsBoolean()
    is_subscription:boolean;

    @IsArray()
    flags:string[];
}