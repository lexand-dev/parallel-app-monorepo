"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Fragment } from "react";
import { useMutation, useQuery } from "@urql/next";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";

import { MemberRole } from "@/features/members/types";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { Separator } from "@/components/ui/separator";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  UPDATE_MEMBER_ROLE,
  DELETE_MEMBER
} from "@/features/members/graphql/mutations";
import { GET_MEMBERS } from "@/features/members/graphql/queries";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

interface QueryResponseMembers {
  getMembers: {
    id: string;
    name: string;
    email: string;
    role: MemberRole;
  }[];
}

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace"
  );

  const [{ data, fetching: isLoading }] = useQuery<QueryResponseMembers>({
    query: GET_MEMBERS,
    variables: { workspaceId }
  });

  const [{ fetching: isUpdatingMember }, updateMember] =
    useMutation(UPDATE_MEMBER_ROLE);
  const [{ fetching: isDeletingMember }, deleteMember] =
    useMutation(DELETE_MEMBER);

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember(
      { memberId, role, workspaceId },
      {
        additionalTypenames: ["Member", "Workspace"],
        requestPolicy: "cache-and-network"
      }
    ).then(({ error, data }) => {
      if (error) {
        toast.error(error.message || "Failed to update member role");
        return;
      }
      toast.success(
        data?.updateRole.message || "Member role updated successfully"
      );
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember(
      { memberId, workspaceId },
      {
        additionalTypenames: ["Workspace"],
        requestPolicy: "network-only"
      }
    ).then(({ error, data }) => {
      if (error) {
        toast.error(error.message || "Failed to remove member");
        return;
      }
      toast.success(
        data?.removeMember.message || "Member removed successfully"
      );
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data?.getMembers) {
    return <PageError message="Project not found" />;
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
        <Badge variant="secondary" className="ml-auto">
          {data?.getMembers.length}{" "}
          {data?.getMembers.length === 1 ? "member" : "members"}
        </Badge>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.getMembers.map((member, index) => (
          <Fragment key={member.id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                className="size-10"
                fallbackClassName="text-lg"
                name={member.name}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{member.name}</p>
                  <Badge
                    variant="default"
                    className="text-xs bg-blue-500 text-white"
                  >
                    {member.role === MemberRole.ADMIN ? "Admin" : "Member"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="secondary" size="icon">
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() =>
                      handleUpdateMember(member.id, MemberRole.ADMIN)
                    }
                    disabled={isUpdatingMember}
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() =>
                      handleUpdateMember(member.id, MemberRole.MEMBER)
                    }
                    disabled={isUpdatingMember}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    onClick={() => handleDeleteMember(member.id)}
                    disabled={isDeletingMember}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.getMembers.length - 1 && (
              <Separator className="my-2.5" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
