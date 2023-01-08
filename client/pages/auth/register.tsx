import { useForm } from "@mantine/form";
import { useMutation } from "react-query";
import { registerUser } from "../../api";
import { AxiosError } from "axios";
import Head from "next/head";
import { Button, Container, Paper, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useRouter } from "next/router";

function RegisterPage() {
    const router = useRouter();

    const form = useForm({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const mutation = useMutation<string, AxiosError, Parameters<typeof registerUser>[0]>(
        registerUser,
        {
            onMutate: () => {
                showNotification({
                    id: "register",
                    title: "Registering...",
                    message: "Please wait while we register you",
                    loading: true,
                });
            },
            onSuccess: () => {
                updateNotification({
                    id: "register",
                    title: "Registered successfully",
                    message: "You can now login",
                });
                router.push("/auth/login");
            },
            onError: () => {
                updateNotification({
                    id: "register",
                    title: "Error",
                    message: "Something went wrong",
                    color: "red",
                });
            },
        }
    );
    return (
        <>
            <Head>
                <title>Register</title>
            </Head>
            <Container>
                <Title>Register</Title>

                <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
                    <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
                        <Stack>
                            <TextInput
                                label='Email'
                                placeholder='johndoe@example.com'
                                required
                                {...form.getInputProps("email")}
                            />
                            <TextInput
                                label='Username'
                                placeholder='johndoe@69'
                                required
                                {...form.getInputProps("username")}
                            />
                            <PasswordInput
                                label='Password'
                                placeholder='Your strong password'
                                required
                                {...form.getInputProps("password")}
                            />
                            <PasswordInput
                                label='Confirm password'
                                placeholder='Your strong password'
                                required
                                {...form.getInputProps("confirmPassword")}
                            />

                            <Button type='submit'>Register</Button>
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </>
    );
}
export default RegisterPage;
