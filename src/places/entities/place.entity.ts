import { ApiProperty } from '@nestjs/swagger';
import { PlaceCategory } from '../enums/placeCategory.enum';
import { PlaceStatus } from '../enums/placeStatus.enum';

export class Place {
  @ApiProperty({
    description: 'Identifiant unique du lieu.',
    example: 'plc_a1b2c3d4',
  })
  id: string;

  @ApiProperty({
    description: 'Nom du lieu.',
    example: 'Bibliothèque Centrale',
  })
  name: string;

  @ApiProperty({
    description: 'Description détaillée du lieu.',
    example: 'Grand espace de travail calme avec accès Wi-Fi haut débit.',
  })
  description: string;

  @ApiProperty({
    description: 'Catégorie du lieu.',
    enum: PlaceCategory,
    example: PlaceCategory.LIBRARY,
  })
  category: PlaceCategory;

  @ApiProperty({
    description: 'Adresse du lieu.',
    example: "7000 rue marie-victorin, montreal",
  })
  address: string;

  @ApiProperty({
    description: 'Liste des services offerts.',
    example: ['Wi-Fi', 'Prises électriques'],
    type: [String],
  })
  services: string[];

  @ApiProperty({
    description: 'Statut du lieu.',
    enum: PlaceStatus,
    example: PlaceStatus.ACTIVE,
  })
  status: PlaceStatus;

  @ApiProperty({
    description: 'Note moyenne des avis attribués au lieu.',
    example: 4.5,
    nullable: true,
  })
  averageRating: number | null;

  @ApiProperty({
    description: "Nombre total d'avis déposés.",
    example: 12,
  })
  reviewCount: number;

  @ApiProperty({
    description: 'Date de création de la ressource.',
    example: '2026-03-30T10:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de dernière mise à jour.',
    example: '2026-03-30T10:00:00.000Z',
  })
  updatedAt: string;
}