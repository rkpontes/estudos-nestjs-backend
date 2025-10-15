import { IsEmail, IsOptional } from 'class-validator';
import { MessageEntity } from 'src/messages/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('authors')
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', unique: true })
  @IsEmail()
  email?: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash?: string;

  @Column({ type: 'varchar', length: 100 })
  name?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  bio?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @OneToMany(() => MessageEntity, message => message.author)
  messages?: MessageEntity[];
}
