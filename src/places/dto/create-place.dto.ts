import { PlaceCategory } from "../enums/placeCategory.enum"
import { PlaceStatus } from "../enums/placeStatus.enum"
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"

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

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsString({each: true})
    services?: string[]

    @IsEnum(PlaceStatus)
    @IsOptional()
    status?: PlaceStatus
}
