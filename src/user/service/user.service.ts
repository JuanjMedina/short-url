import { isValidObjectId, Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../model/user.model';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto, UserDto } from '../dto/user.dto';
import { ErrorManager } from '@/utils/error.manager';
import { IDeleteUser } from '@/auth/interfaces/auth.interfaces';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async createUser(body: UserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      // const userExists = await this.userModel.findOne({ email: body.email });

      // if (userExists) {
      //   throw new ErrorManager({
      //     message: 'User already exists',
      //     type: 'BAD_REQUEST',
      //   });
      // }

      const userCreated = await this.userModel.create({
        ...body,
        password: hashedPassword,
      });
      userCreated.save();

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

  public async findUserById(sub: string): Promise<User> {
    try {
      if (!Types.ObjectId.isValid(sub)) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Invalid object id for this user',
        });
      }

      const user = await this.userModel.findOne({
        _id: new Types.ObjectId(sub),
      });

      if (!user) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'User not found',
        });
      }

      return user;
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  public async deleteUser(id: string): Promise<IDeleteUser> {
    try {
      if (!isValidObjectId(id)) {
        throw new ErrorManager({
          message: 'Invalid user ID format',
          type: 'BAD_REQUEST',
        });
      }

      const user = await this.userModel.findById(id);
      if (!user) {
        throw new ErrorManager({
          message: 'User not found',
          type: 'NOT_FOUND',
        });
      }

      const userDeleted = await this.userModel.findByIdAndDelete(id);

      return {
        message: 'User deleted successfully',
        user: userDeleted,
      };
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
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
