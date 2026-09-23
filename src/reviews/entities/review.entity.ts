import { ApiProperty } from '@nestjs/swagger';

export class Review {
  @ApiProperty({
    description: "Identifiant unique de la critique",
    example: 'rev_a1b2c3d4',
  })
  id: string;

  @ApiProperty({
    description: "Identifiant du lieu associé",
    example: 'plc_91cc99fd',
  })
  placeId: string;

  @ApiProperty({
    description: "Nom de l'auteur de la critique",
    example: 'Alice Dupuis',
  })
  authorName: string;

  @ApiProperty({
    description: 'Note attribuée (entre 1 et 5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    description: 'Commentaire détaillé sur le lieu',
    example: 'Super endroit, très calme et parfait pour étudier.',
  })
  comment: string;

  @ApiProperty({
    description: 'Date de création (format ISO 8601)',
    example: '2026-09-22T12:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de dernière modification (format ISO 8601)',
    example: '2026-09-22T12:00:00.000Z',
  })
  updatedAt: string;
}