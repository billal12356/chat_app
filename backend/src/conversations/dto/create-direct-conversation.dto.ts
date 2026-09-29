import {
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateDirectConversationDto {
  @IsInt()
  @IsPositive()
  userId: number;
}