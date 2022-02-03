import { v4 as uuid } from 'uuid';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from '../../users/entities/User';
import { DecimalTransformer } from '../../../shared/infra/typeorm/transformers/DecimalTransformer';

@Entity('transfers')
export class Transfer {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid', {name: 'sender_id'})
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column('uuid', {name: 'recipient_id'})
  recipientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @Column()
  description: string;

  @Column('decimal', {
    precision: 5,
    scale: 2,
    transformer: new DecimalTransformer()
  })
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
