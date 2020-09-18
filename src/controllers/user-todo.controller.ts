import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Todo, User
} from '../models';
import {UserRepository} from '../repositories';

export class UserTodoController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/todos', {
    responses: {
      '200': {
        description: 'Array of User has many Todo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Todo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Todo>,
  ): Promise<Todo[]> {
    return this.userRepository.todos(id).find(filter);
  }

  @post('/users/{id}/todos', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Todo)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.userId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {
            title: 'NewTodoInUser',
            exclude: ['postId'],
            optional: ['userId']
          }),
        },
      },
    }) todo: Omit<Todo, 'postId'>,
  ): Promise<Todo> {
    return this.userRepository.todos(id).create(todo);
  }

  @patch('/users/{id}/todos/{postId}', {
    responses: {
      '200': {
        description: 'User.Todo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @param.path.number("postId") postId: number, //把網址的postId宣告為postId
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Partial<Todo>,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
  ): Promise<Count> {
    return this.userRepository.todos(id).patch(todo, {postId}); // where的地方改成{postId}會更新特定ID文章
  }

  @del('/users/{id}/todos', {
    responses: {
      '200': {
        description: 'User.Todo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
  ): Promise<Count> {
    return this.userRepository.todos(id).delete(where);
  }
}
