import { AppShell, Navbar, Header, Box, Anchor, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import SideBar from "../components/SideBar/SideBar";
import UploadVideo from "../components/UploadVideo";
import { useMe } from "../context/me";
import { VideoContextProvider } from "../context/video";

function HomePageLayout({ children }: { children: React.ReactNode }) {
    const { user, refetch } = useMe();
    console.log(user);
    return (
        <VideoContextProvider>
            <AppShell
                padding='md'
                navbar={<SideBar />}
                header={
                    <Header height={60} p='xs'>
                        <Box sx={() => ({ display: "flex" })}>
                            <Box
                                sx={() => ({
                                    flex: "1",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    padding: "0 10px",
                                })}
                            >
                                <Image src='/logo.svg' alt='logo' width={40} height={40} />
                                <Text weight={800} size='xl' ml='lg'>
                                    Video Shack
                                </Text>
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

                            {user && <UploadVideo />}
                        </Box>
                    </Header>
                }
            >
                {children}
            </AppShell>
        </VideoContextProvider>
    );
}

export default HomePageLayout;
