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
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { UploadFileMiddleware } from '../../libs/rest/middleware/upload-file.middleware.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';
import { PublicRouteMiddleware } from '../../libs/rest/middleware/public-route.middleware.js';
import { AuthService } from '../auth/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PublicRouteMiddleware(),
        new ValidateDtoMiddleware(CreateUserDto)
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/check',
      method: HttpMethod.Get,
      handler: this.checkAuth,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
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
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    this.ok(res, fillDTO(LoggedUserRdo, { email: user.email, token }));
  }

  public async logout(_req: Request, res: Response): Promise<void> {
    this.noContent(res, { message: 'Logged out successfully' });
  }

  public async checkAuth(req: Request, res: Response): Promise<void> {
    const { id: userId } = req.tokenPayload!;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not found',
        'UserController'
      );
    }

    this.ok(res, fillDTO(UserRdo, user));
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    if (!req.file) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Avatar file is required',
        'UserController'
      );
    }

    const avatar = req.file.filename;
    await this.userService.updateById(userId, { avatar });

    this.created(res, { filepath: avatar });
  }
}
