import {IsNotEmpty, IsNumber, IsString} from "class-validator";

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
