import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Todo, TodoRelations, User} from '../models';
import {PgDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.postId,
  TodoRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Todo.prototype.postId>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Todo, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
