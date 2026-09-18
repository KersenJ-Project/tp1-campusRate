import { PlaceCategory } from "../enums/placeCategory.enum"
import { PlaceStatus } from "../enums/placeStatus.enum"
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"

export class CreatePlaceDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    description: string

    @IsEnum(PlaceCategory)
    @IsNotEmpty()
    category: PlaceCategory

    @IsString()
    @IsNotEmpty()
    address: string

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    services?: string[]

    @IsEnum(PlaceStatus)
    @IsOptional()
    status?: PlaceStatus
}
