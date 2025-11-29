import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({ path: '/logout', method: HttpMethod.Post, handler: this.logout });
    this.addRoute({ path: '/check', method: HttpMethod.Get, handler: this.checkAuth });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateUserDto;
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(req: Request, res: Response): Promise<void> {
    const body = req.body as LoginUserDto;
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    const passwordValid = await this.userService.verifyPassword(
      body.password,
      user.password,
      this.configService.get('SALT')
    );

    if (!passwordValid) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid email or password.',
        'UserController',
      );
    }

    this.ok(res, fillDTO(UserRdo, user));
  }

  public async logout(_req: Request, res: Response): Promise<void> {
    this.noContent(res, { message: 'Logged out successfully' });
  }

  public async checkAuth(_req: Request, res: Response): Promise<void> {
    // TODO: JWT in future, а щас заглушка в виде мокового пользователя
    const mockUser = {
      id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: 'avatar.jpg',
      type: 'обычный'
    };
    this.ok(res, fillDTO(UserRdo, mockUser));
  }
}
