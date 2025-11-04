export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER"
}

export type Member = {
  id: string;
  name: string;
  email: string;
};
