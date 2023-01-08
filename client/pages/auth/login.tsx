import { useForm } from "@mantine/form";
import { useMutation } from "react-query";
import { loginUser } from "../../api";
import { AxiosError } from "axios";
import Head from "next/head";
import { Button, Container, Paper, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useRouter } from "next/router";

function LoginPage() {
    const router = useRouter();

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
    });

    const mutation = useMutation<string, AxiosError, Parameters<typeof loginUser>[0]>(loginUser, {
        onSuccess: () => {
            router.push("/");
        },
    });
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <Container>
                <Title>Login</Title>

                <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
                    <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
                        <Stack>
                            <TextInput
                                label='Email'
                                placeholder='johndoe@example.com'
                                required
                                {...form.getInputProps("email")}
                            />

                            <PasswordInput
                                label='Password'
                                placeholder='Your strong password'
                                required
                                {...form.getInputProps("password")}
                            />

                            <Button type='submit'>Login</Button>
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </>
    );
}
export default LoginPage;