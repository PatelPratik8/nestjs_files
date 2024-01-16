import {  IsNumberString } from "class-validator";

export class CreateTaskDto{
    @IsNumberString()
    fileId?: Number;

}