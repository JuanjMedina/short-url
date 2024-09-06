import { isValidObjectId, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../model/user.model';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto, UserDto } from '../dto/user.dto';
import { ErrorManager } from '@/utils/error.manager';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async createUser(body: UserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const userExists = await this.userModel.findOne({ email: body.email });

      if (userExists) {
        throw new ErrorManager({
          message: 'User already exists',
          type: 'BAD_REQUEST',
        });
      }

      const userCreated = await this.userModel.create({
        ...body,
        password: hashedPassword,
      });

      console.log(`userCreated ${userCreated}`);
      return userCreated;
    } catch (error) {
      if (error.code === 11000) {
        throw new ErrorManager({
          message: 'User already exists',
          type: 'BAD_REQUEST',
        });
      }
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      const users: User[] = await this.userModel.find();
      if (users.length === 0) {
        throw new ErrorManager({
          message: 'Not results for this search',
          type: 'BAD_REQUEST',
        });
      }
      return users;
    } catch (Err) {
      throw ErrorManager.createSignatureError(Err.message);
    }
  }

  public deleteUser(id: string) {
    try {
      if (isValidObjectId(id) === false)
        throw new ErrorManager({
          message: 'Invalid user id ',
          type: 'BAD_REQUEST',
        });
      const userdeleted = this.userModel.findByIdAndDelete(id);
      return userdeleted;
    } catch (Err) {
      throw ErrorManager.createSignatureError(Err.message);
    }
  }

  public async updateUser(id: string, body: UpdateUserDto): Promise<User> {
    try {
      if (isValidObjectId(id) === false)
        throw new ErrorManager({
          message: 'Invalid user id ',
          type: 'BAD_REQUEST',
        });

      const userUpdated = await this.userModel.findByIdAndUpdate(
        id,
        {
          ...body,
        },
        { new: true },
      );
      return userUpdated;
    } catch (Err) {
      throw ErrorManager.createSignatureError(Err.message);
    }
  }
  public async searchBy({
    key,
    value,
  }: {
    key: keyof UserDto;
    value: any;
  }): Promise<User> {
    try {
      const query = { [key]: value };
      const user: User = await this.userModel.findOne(query);
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
