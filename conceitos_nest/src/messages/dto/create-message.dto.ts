import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 255)
  readonly message: string;

  @IsNotEmpty()
  @IsNumber()
  readonly authorId: number;
}
