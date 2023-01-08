import { AppShell, Navbar, Header, Box, Anchor } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useMe } from "../context/me";

function HomePageLayout({ children }: { children: React.ReactNode }) {
    const { user, refetch } = useMe();
    console.log(user);
    return (
        <AppShell
            padding='md'
            navbar={
                <Navbar width={{ base: 300 }} height={500} p='xs'>
                    Side Bar Items
                </Navbar>
            }
            header={
                <Header height={60} p='xs'>
                    <Box sx={() => ({ display: "flex" })}>
                        <Box sx={() => ({ flex: "1" })}>
                            <Image src='/logo.png' alt='logo' width={100} height={40} />
                        </Box>
                        {!user && (
                            <>
                                <Link href='/auth/login' passHref>
                                    <Anchor ml='lg' mr='lg'>
                                        Login
                                    </Anchor>
                                </Link>
                                <Link href='/auth/register' passHref>
                                    <Anchor ml='lg' mr='lg'>
                                        Register
                                    </Anchor>
                                </Link>
                            </>
                        )}

                        {user && <p>Upload video</p>}
                    </Box>
                </Header>
            }
        >
            {children}
        </AppShell>
    );
}

export default HomePageLayout;
