import { Input } from "./ui/input";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { LoginCredentials } from "@/types/LoginCredentials";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "./ui/form";
import { FC, use, useEffect } from "react";
import { Mail, MessageSquare, User } from "lucide-react";
import { validatorResolver } from "@/lib/validatorjsResolver";
interface props {
    isOpen?: boolean;
    isLoading?: boolean;
    onClose?: () => void;
    onSubmit: (data: LoginCredentials) => void;
}
export const AnonymousLogin: FC<props> = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const rules = {
        username: "required|min:3|max:15",
        email: "required|email",
    };
    const form = useForm<LoginCredentials>({
        defaultValues: {
            username: "",
            email: "",
        },
        resolver: validatorResolver(
            rules,
            {},
            {
                username: "Nombre de usuario",
                email: "Correo electrónico",
            }
        ),
    });
    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <Form {...form}>
                <DialogContent className="sm:max-w-md bg-[#333333] border-gray-700 shadow-xl p-3 md:p-6 ">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="text-center space-y-2">
                            <div className="mx-auto w-12 h-12 bg-[#f44336]/10 rounded-full flex items-center justify-center">
                                <MessageSquare className="h-6 w-6 text-[var(--primary-color)]" />
                            </div>
                            <h5 className="text-xl text-white">Únete al Chat</h5>
                            <span className="text-gray-400">Ingresa tus datos para participar en la conversación</span>
                        </div>
                        <div className="grid gap-4 mt-4">
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-300">Nombre de usuario</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                                    <Input
                                                        placeholder="Nombre de usuario"
                                                        className="pl-10 bg-[#424242] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-[#03a9f4] focus-visible:border-[#03a9f4"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-300">Correo electrónico</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                                    <Input
                                                        placeholder="Correo electrónico"
                                                        className="pl-10 bg-[#424242] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-[#03a9f4] focus-visible:border-[#03a9f4"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <DialogClose asChild>
                                <Button variant="outline" disabled={isLoading}>
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit" className="text-white">
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Ingresando...
                                    </div>
                                ) : (
                                    <>Ingresar</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Form>
        </Dialog>
    );
};
