import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Numéro de la page courante.',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: "Nombre d'éléments par page.",
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: "Nombre total d'éléments disponibles.",
    example: 42,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Nombre total de pages.',
    example: 5,
  })
  totalPages: number;
}

export class PaginatedResultDto<T> {
  data: T[];

  @ApiProperty({
    description: 'Métadonnées de pagination.',
    type: PaginationMetaDto,
  })
  pagination: PaginationMetaDto;
}