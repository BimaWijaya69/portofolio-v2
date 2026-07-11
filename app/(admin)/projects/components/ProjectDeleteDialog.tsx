// app/(admin)/projects/components/ProjectDeleteDialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ProjectDeleteDialogProps {
  projectName: string;
  onConfirm: () => void;
}

export function ProjectDeleteDialog({
  projectName,
  onConfirm,
}: ProjectDeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-red-500/40 text-red-300 hover:bg-red-500/10"
        >
          <Trash2 size={14} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-white/10 bg-zinc-950 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Project?</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Apakah kamu yakin ingin menghapus project{" "}
            <strong>"{projectName}"</strong>?
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
