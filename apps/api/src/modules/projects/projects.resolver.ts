import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Resolver('Project')
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation('createProject')
  create(@Args('createProjectInput') createProjectInput: CreateProjectInput) {
    return this.projectsService.create(createProjectInput);
  }

  @Query('projects')
  findAll() {
    return this.projectsService.findAll();
  }

  @Query('project')
  findOne(@Args('id') id: number) {
    return this.projectsService.findOne(id);
  }

  @Mutation('updateProject')
  update(@Args('updateProjectInput') updateProjectInput: UpdateProjectInput) {
    return this.projectsService.update(updateProjectInput.id, updateProjectInput);
  }

  @Mutation('removeProject')
  remove(@Args('id') id: number) {
    return this.projectsService.remove(id);
  }
}
