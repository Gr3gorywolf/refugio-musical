import { Input } from "./ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useForm } from "react-hook-form";
import { LoginCredentials } from "@/types/LoginCredentials";
interface props {
    isOpen?: boolean;
    onClose?: () => void;
}
export const AnonymousLogin = () => {
    const { register, handleSubmit, formState } = useForm<LoginCredentials>({

    });
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] ">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Nombre de usuario</Label>
                            <Input id="username-1" {...register("username")} />
                            {formState.errors.username && <Label className="text-red-500" >{formState.errors.username?.message}</Label>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Correo electronico</Label>
                            <Input id="name-1" type="email" {...register("email")} />
                            {formState.errors.email && <Label className="text-red-500" >{formState.errors.email?.message}</Label>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};
