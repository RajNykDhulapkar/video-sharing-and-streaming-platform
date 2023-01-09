import { useForm } from "@mantine/form";
import { useMutation } from "react-query";
import { loginUser } from "../../api";
import { AxiosError } from "axios";
import Head from "next/head";
import {
    Button,
    ButtonProps,
    Container,
    Divider,
    Group,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { GoogleIcon } from "../../components/GoogleIcon";
import { getGoogleOAuthURL } from "../../utils/oauth";

function GoogleButton(props: ButtonProps) {
    return (
        <Button
            onClick={() => (window.location.href = getGoogleOAuthURL())}
            leftIcon={<GoogleIcon />}
            variant='default'
            color='gray'
            {...props}
        />
    );
}

function LoginPage() {
    const router = useRouter();

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
            password: (val) =>
                val.length <= 6 ? "Password should include at least 6 characters" : null,
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
            <Container size='xs' pt='xl'>
                <Paper withBorder shadow='md' radius='md' p='xl' mt='xl'>
                    <Text size='xl' weight={500}>
                        Welcome to Video Shack
                    </Text>
                    <form
                        style={{ marginTop: "1.5rem" }}
                        onSubmit={form.onSubmit((values) => mutation.mutate(values))}
                    >
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
                    <Divider label='Or continue with email' labelPosition='center' my='lg' />
                    <Group grow mb='md' mt='md'>
                        <GoogleButton radius='xl'>Google</GoogleButton>
                        {/* <TwitterButton radius='xl'>Twitter</TwitterButton> */}
                    </Group>
                </Paper>
            </Container>
        </>
    );
}

export default LoginPage;
