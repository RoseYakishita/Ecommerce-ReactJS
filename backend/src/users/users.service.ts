import { Injectable, NotFoundException, ConflictException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    this.logger.log('Checking for admin account...');
    const adminEmail = 'rose@admin.com';
    const existingAdmin = await this.usersRepository.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      this.logger.log(`Admin account not found. Creating admin: ${adminEmail}`);
      const hashedPassword = await bcrypt.hash('33213456', 10);
      const admin = this.usersRepository.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: UserRole.ADMIN,
      });
      await this.usersRepository.save(admin);
      this.logger.log('Admin account created successfully.');
    } else {
      this.logger.log('Admin account already exists.');
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { email: userData.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // Usually checking admin roles or setting default
    const user = this.usersRepository.create({
      ...userData,
      role: userData.role || UserRole.USER,
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'name', 'role', 'createdAt', 'updatedAt'] 
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateProfile(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    
    // Do not allow updating password or role via this basic profile update
    if (updateData.password) delete updateData.password;
    if (updateData.role) delete updateData.role;

    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }
}
