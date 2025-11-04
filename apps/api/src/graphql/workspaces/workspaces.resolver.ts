import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';

@Resolver('Workspace')
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}
  @Query('getWorkspaces')
  getWorkspaces() {
    return this.workspacesService.findAll();
  }

  @Query('getWorkspace')
  getWorkspace(@Args('id') id: string) {
    // return this.workspacesService.findById(id);
  }

  @Mutation('createWorkspace')
  createWorkspace(@Args('name') name: string, @Args('image') image?: any) {
    //return this.workspacesService.create(name, image);
  }

  @Mutation('deleteWorkspace')
  deleteWorkspace(@Args('id') id: string) {
    // return this.workspacesService.delete(id);
  }
}
