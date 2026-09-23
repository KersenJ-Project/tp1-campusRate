import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: "Nom de l'auteur de l'avis",
    example: 'Mathis Favier',
  })
  @IsString()
  @IsNotEmpty()
  authorName: string;

  @ApiProperty({
    description: 'Note attribuée (entre 1 et 5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: "Commentaire détaillé sur l'endroit",
    example: 'Super endroit, très calme et parfait pour étudier.',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  comment: string;
}