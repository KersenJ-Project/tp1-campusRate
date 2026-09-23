import { ApiProperty } from '@nestjs/swagger';

export class ProblemDetailsDto {
  @ApiProperty({
    description: 'Référence identifiant le type de problème.',
  })
  type: string;

  @ApiProperty({
    description: "Résumé rapide du type de problème.",
    example: 'Internal Server Error',
  })
  title: string;

  @ApiProperty({
    description: "Code d'état HTTP généré par le serveur.",
    example: 500,
  })
  status: number;

  @ApiProperty({
    description: "Explication spécifique à ce problème.",
    example: 'Une erreur interne inattendue est survenue.',
  })
  detail: string;

  @ApiProperty({
    description: "URI qui identifie la position du problème.",
    example: '/api/v1/resource',
  })
  instance: string;
}