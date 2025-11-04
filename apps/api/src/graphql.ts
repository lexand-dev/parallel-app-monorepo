
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}

export enum TaskStatus {
    BACKLOG = "BACKLOG",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    IN_REVIEW = "IN_REVIEW",
    DONE = "DONE"
}

export class SignUpInput {
    name: string;
    password: string;
    email: string;
}

export class SignInInput {
    email: string;
    password: string;
}

export class BulkTask {
    id: string;
    status?: Nullable<TaskStatus>;
    position?: Nullable<number>;
}

export class ImageInput {
    file?: Nullable<Upload>;
    url?: Nullable<string>;
}

export abstract class IQuery {
    abstract getAnalyticsProject(projectId: string): Nullable<Analytics> | Promise<Nullable<Analytics>>;

    abstract getAnalyticsWorkspace(workspaceId: string): Nullable<Analytics> | Promise<Nullable<Analytics>>;

    abstract getMembers(workspaceId: string): Nullable<Nullable<Member>[]> | Promise<Nullable<Nullable<Member>[]>>;

    abstract getProjects(workspaceId: string): Nullable<Nullable<Project>[]> | Promise<Nullable<Nullable<Project>[]>>;

    abstract getProject(projectId: string): Nullable<Project> | Promise<Nullable<Project>>;

    abstract getTasks(workspaceId: string, projectId?: Nullable<string>, assigneeId?: Nullable<string>, status?: Nullable<TaskStatus>, search?: Nullable<string>, dueDate?: Nullable<string>): Nullable<Nullable<Task>[]> | Promise<Nullable<Nullable<Task>[]>>;

    abstract getTask(id: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract getWorkspaces(): Nullable<Nullable<Workspace>[]> | Promise<Nullable<Nullable<Workspace>[]>>;

    abstract getWorkspace(id: string): Nullable<Workspace> | Promise<Nullable<Workspace>>;

    abstract getWorkspaceInfo(id: string): Nullable<WorkspaceInfo> | Promise<Nullable<WorkspaceInfo>>;
}

export class Analytics {
    taskCount?: Nullable<number>;
    taskDifference?: Nullable<number>;
    assignedTaskCount?: Nullable<number>;
    assignedTaskDifference?: Nullable<number>;
    completedTaskCount?: Nullable<number>;
    completedTaskDifference?: Nullable<number>;
    incompleteTaskCount?: Nullable<number>;
    incompleteTaskDifference?: Nullable<number>;
    overdueTaskCount?: Nullable<number>;
    overdueTaskDifference?: Nullable<number>;
}

export abstract class IMutation {
    abstract signup(input: SignUpInput): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;

    abstract signin(input: SignInInput): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;

    abstract logout(): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;

    abstract removeMember(memberId: string, workspaceId: string): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;

    abstract updateRole(memberId: string, role: MemberRole, workspaceId: string): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;

    abstract createProject(name: string, workspaceId: string, image?: Nullable<ImageInput>): Nullable<Project> | Promise<Nullable<Project>>;

    abstract updateProject(id: string, name: string, image?: Nullable<ImageInput>): Nullable<Project> | Promise<Nullable<Project>>;

    abstract deleteProject(id: string): Nullable<Project> | Promise<Nullable<Project>>;

    abstract createTask(name: string, status: TaskStatus, workspaceId: string, projectId: string, dueDate: string, assigneeId: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract updateTask(id: string, name?: Nullable<string>, status?: Nullable<TaskStatus>, dueDate?: Nullable<string>, projectId?: Nullable<string>, assigneeId?: Nullable<string>, description?: Nullable<string>): Nullable<Task> | Promise<Nullable<Task>>;

    abstract deleteTask(id: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract bulkUpdateTasks(tasks: BulkTask[]): Nullable<Nullable<Task>[]> | Promise<Nullable<Nullable<Task>[]>>;

    abstract createWorkspace(name: string, image?: Nullable<ImageInput>): Nullable<Workspace> | Promise<Nullable<Workspace>>;

    abstract updateWorkspace(id: string, name: string, image?: Nullable<ImageInput>): Nullable<Workspace> | Promise<Nullable<Workspace>>;

    abstract deleteWorkspace(id: string): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;

    abstract joinWorkspace(inviteCode: string, workspaceId: string): Nullable<Workspace> | Promise<Nullable<Workspace>>;

    abstract resetInviteCode(id: string): Nullable<Workspace> | Promise<Nullable<Workspace>>;
}

export class SuccessResponse {
    success?: Nullable<boolean>;
    message?: Nullable<string>;
}

export class Member {
    id?: Nullable<string>;
    name?: Nullable<string>;
    role?: Nullable<MemberRole>;
    email?: Nullable<string>;
}

export class Project {
    id?: Nullable<string>;
    name?: Nullable<string>;
    image?: Nullable<string>;
    workspaceId?: Nullable<string>;
}

export class Task {
    id?: Nullable<string>;
    name?: Nullable<string>;
    status?: Nullable<TaskStatus>;
    workspaceId?: Nullable<string>;
    projectId?: Nullable<string>;
    dueDate?: Nullable<string>;
    assigneeId?: Nullable<string>;
    description?: Nullable<string>;
    position?: Nullable<number>;
}

export class User {
    id?: Nullable<string>;
    name?: Nullable<string>;
    email?: Nullable<string>;
}

export class Workspace {
    id?: Nullable<string>;
    name?: Nullable<string>;
    image?: Nullable<string>;
    userId?: Nullable<string>;
    inviteCode?: Nullable<string>;
    members?: Nullable<Nullable<Member>[]>;
}

export class WorkspaceInfo {
    name?: Nullable<string>;
}

export type Upload = any;
type Nullable<T> = T | null;
