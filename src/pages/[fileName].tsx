import { Box, Center, HStack, Icon, Image, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { BiImage } from "react-icons/bi";

export default function FileViewer() {
  const router = useRouter();
  const { fileName } = router.query;

  return (
    <>
      <Head>
        <title>{fileName}</title>
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${fileName}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Center h="100vh" w="full" bgColor="gray.900">
        <Box boxShadow="2xl" borderRadius={10} bgColor="gray.800" padding={5}>
          <Image
            src={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${fileName}`}
            borderRadius={5}
            alt="Uploaded image"
            w="full"
          />
          <HStack pt={2} justifyContent="center">
            <Icon as={BiImage} color="white" w={7} h={7} />
            <Text color="white" fontSize="2xl">
              {fileName}
            </Text>
          </HStack>
        </Box>
      </Center>
    </>
  );
}
