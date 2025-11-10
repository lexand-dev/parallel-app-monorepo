
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

export interface SignUpInput {
    name: string;
    password: string;
    email: string;
}

export interface SignInInput {
    email: string;
    password: string;
}

export interface ImageInput {
    file?: Nullable<Upload>;
    url?: Nullable<string>;
}

export interface BulkTask {
    id: string;
    status?: Nullable<TaskStatus>;
    position?: Nullable<number>;
}

export interface IQuery {
    getAnalyticsProject(projectId: string): Nullable<Analytics> | Promise<Nullable<Analytics>>;
    getAnalyticsWorkspace(workspaceId: string): Nullable<Analytics> | Promise<Nullable<Analytics>>;
    getMembers(workspaceId: string): Nullable<Nullable<Member>[]> | Promise<Nullable<Nullable<Member>[]>>;
    getProjects(workspaceId: string): Nullable<Nullable<Project>[]> | Promise<Nullable<Nullable<Project>[]>>;
    getProject(projectId: string): Nullable<Project> | Promise<Nullable<Project>>;
    getTasks(workspaceId: string, projectId?: Nullable<string>, assigneeId?: Nullable<string>, status?: Nullable<TaskStatus>, search?: Nullable<string>, dueDate?: Nullable<string>): Nullable<Nullable<Task>[]> | Promise<Nullable<Nullable<Task>[]>>;
    getTask(id: string): Nullable<Task> | Promise<Nullable<Task>>;
    current(): Nullable<User> | Promise<Nullable<User>>;
    getWorkspaces(): Nullable<Nullable<Workspace>[]> | Promise<Nullable<Nullable<Workspace>[]>>;
    getWorkspace(id: string): Nullable<Workspace> | Promise<Nullable<Workspace>>;
    getWorkspaceInfo(id: string): Nullable<WorkspaceInfo> | Promise<Nullable<WorkspaceInfo>>;
}

export interface Analytics {
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

export interface IMutation {
    signup(input: SignUpInput): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;
    signin(input: SignInInput): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;
    logout(): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;
    removeMember(memberId: string, workspaceId: string): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;
    updateRole(memberId: string, role: MemberRole, workspaceId: string): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;
    createProject(name: string, workspaceId: string, image?: Nullable<ImageInput>): Nullable<Project> | Promise<Nullable<Project>>;
    updateProject(id: string, name: string, image?: Nullable<ImageInput>): Nullable<Project> | Promise<Nullable<Project>>;
    deleteProject(id: string): Nullable<Project> | Promise<Nullable<Project>>;
    createTask(name: string, status: TaskStatus, workspaceId: string, projectId: string, dueDate: string, assigneeId: string): Nullable<Task> | Promise<Nullable<Task>>;
    updateTask(id: string, name?: Nullable<string>, status?: Nullable<TaskStatus>, dueDate?: Nullable<string>, projectId?: Nullable<string>, assigneeId?: Nullable<string>, description?: Nullable<string>): Nullable<Task> | Promise<Nullable<Task>>;
    deleteTask(id: string): Nullable<Task> | Promise<Nullable<Task>>;
    bulkUpdateTasks(tasks: BulkTask[]): Nullable<Nullable<Task>[]> | Promise<Nullable<Nullable<Task>[]>>;
    createWorkspace(name: string, image?: Nullable<ImageInput>): Nullable<Workspace> | Promise<Nullable<Workspace>>;
    updateWorkspace(id: string, name: string, image?: Nullable<ImageInput>): Nullable<Workspace> | Promise<Nullable<Workspace>>;
    deleteWorkspace(id: string): Nullable<SuccessResponse> | Promise<Nullable<SuccessResponse>>;
    joinWorkspace(inviteCode: string, workspaceId: string): Nullable<Workspace> | Promise<Nullable<Workspace>>;
    resetInviteCode(id: string): Nullable<Workspace> | Promise<Nullable<Workspace>>;
}

export interface SuccessResponse {
    success?: Nullable<boolean>;
    message?: Nullable<string>;
}

export interface Member {
    id?: Nullable<string>;
    name?: Nullable<string>;
    role?: Nullable<MemberRole>;
    email?: Nullable<string>;
}

export interface Project {
    id?: Nullable<string>;
    name?: Nullable<string>;
    image?: Nullable<string>;
    workspaceId?: Nullable<string>;
}

export interface Task {
    id?: Nullable<string>;
    name?: Nullable<string>;
    status?: Nullable<TaskStatus>;
    workspaceId?: Nullable<string>;
    projectId?: Nullable<string>;
    dueDate?: Nullable<string>;
    assigneeId?: Nullable<string>;
    description?: Nullable<string>;
    position?: Nullable<number>;
    assignee?: Nullable<User>;
    project?: Nullable<Project>;
}

export interface User {
    id?: Nullable<string>;
    name?: Nullable<string>;
    email?: Nullable<string>;
}

export interface Workspace {
    id?: Nullable<string>;
    name?: Nullable<string>;
    image?: Nullable<string>;
    userId?: Nullable<string>;
    inviteCode?: Nullable<string>;
    members?: Nullable<Nullable<Member>[]>;
}

export interface WorkspaceInfo {
    name?: Nullable<string>;
}

export type Upload = any;
type Nullable<T> = T | null;
