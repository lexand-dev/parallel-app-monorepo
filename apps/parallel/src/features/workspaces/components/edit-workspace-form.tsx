"use client";

import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation } from "@urql/next";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import {
  DELETE_WORKSPACE,
  UPDATE_WORKSPACE,
  RESET_INVITE_CODE
} from "../graphql/mutations";
import { updateWorkspaceSchema, Workspace } from "../schemas";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValues
}: EditWorkspaceFormProps) => {
  const router = useRouter();
  const [{ fetching: isUpdating }, editWorkspace] =
    useMutation(UPDATE_WORKSPACE);
  const [{ fetching: isDeleting }, deleteWorkspace] =
    useMutation(DELETE_WORKSPACE);
  const [{ fetching: isResettingInviteCode }, resetInviteCode] =
    useMutation(RESET_INVITE_CODE);

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone."
  );

  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite link",
    "This will invalidate the current invite link"
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.image ?? ""
    }
  });

  const handleDelete = () => {
    confirmDelete().then((confirmed) => {
      if (confirmed) {
        deleteWorkspace(
          { id: initialValues.id },
          { additionalTypenames: ["Workspace"] }
        ).then(({ error }) => {
          if (error) {
            toast.error(error.message || "Error deleting workspace");
            return;
          }
          toast.success("Workspace deleted successfully");
          window.location.href = "/";
        });
      }
    });
  };

  const handleResetInviteCode = () => {
    confirmReset().then((confirmed) => {
      if (confirmed) {
        resetInviteCode(
          { id: initialValues.id },
          { additionalTypenames: ["Workspace"] }
        ).then(({ error }) => {
          if (error) {
            toast.error(error.message || "Error resetting invite code");
            return;
          }
          toast.success("Invite code reset successfully");
          router.refresh();
        });
      }
    });
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    let imageInput: { file?: File; url?: string } | undefined = undefined;

    if (values.image instanceof File) {
      imageInput = { file: values.image };
    } else if (typeof values.image === "string" && values.image.trim() !== "") {
      imageInput = { url: values.image };
    }

    const finalValues = {
      id: initialValues.id,
      name: values.name,
      image: imageInput
    };

    editWorkspace(finalValues, {
      additionalTypenames: ["Workspace"]
    }).then(({ data, error }) => {
      if (error) {
        toast.error(error.message || "Error updating workspace");
        return;
      }
      form.reset();
      toast.success("Workspace updated successfully");
      router.push(`/workspaces/${data?.updateWorkspace.id}`);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const fullInviteLink = `${process.env.NEXT_PUBLIC_APP_URL!}/workspaces/${
    initialValues.id
  }/join/${initialValues.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="teritary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.id}`)
            }
          >
            <ArrowLeftIcon className="mr-2 size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              alt="Logo"
                              fill
                              className="object-cover"
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-9 text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max 1mb
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            accept=".jpg, .png, .jpeg, .svg"
                            ref={inputRef}
                            onChange={handleImageChange}
                            disabled={isUpdating}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isUpdating}
                              variant="destructive"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isUpdating}
                              variant="teritary"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isUpdating}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isUpdating || isDeleting}
                  type="submit"
                  size="lg"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-ful h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} />
                <Button
                  onClick={handleCopyInviteLink}
                  variant="secondary"
                  className="size-12"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isUpdating || isResettingInviteCode}
              onClick={handleResetInviteCode}
            >
              Reset invite link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-ful h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-4 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isUpdating || isDeleting}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
