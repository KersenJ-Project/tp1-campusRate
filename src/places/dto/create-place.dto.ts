import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { PlaceCategory } from '../enums/placeCategory.enum';
import { PlaceStatus } from '../enums/placeStatus.enum';

export class CreatePlaceDto {
  @ApiProperty({
    description: 'Nom du lieu.',
    example: 'Bibliothèque Centrale',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description détaillée du lieu.',
    example: 'Grand espace de travail calme avec accès Wi-Fi haut débit.',
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  description: string;

  @ApiProperty({
    description: 'Catégorie du lieu.',
    enum: PlaceCategory,
    example: PlaceCategory.LIBRARY,
  })
  @IsEnum(PlaceCategory)
  @IsNotEmpty()
  category: PlaceCategory;

  @ApiProperty({
    description: 'Adresse physique du lieu.',
    example: "7000 rue marie-victorin",
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({
    description: 'Liste des services offerts par le lieu.',
    example: ['Wi-Fi', 'Prises électriques', 'Imprimante'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  services?: string[];

  @ApiPropertyOptional({
    description: 'Statut actuel du lieu.',
    enum: PlaceStatus,
    default: PlaceStatus.ACTIVE,
    example: PlaceStatus.ACTIVE,
  })
  @IsEnum(PlaceStatus)
  @IsOptional()
  status?: PlaceStatus;
}