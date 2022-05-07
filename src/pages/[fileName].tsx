import {
  Box,
  Center,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { BiImage } from "react-icons/bi";

export default function FileViewer() {
  const router = useRouter();
  const { fileName } = router.query;
  const [failed, setFailed] = useBoolean();

  return (
    <>
      <Head>
        <title>{fileName}</title>
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${fileName}`}
        />
      </Head>
      <Center h="100vh" w="full" bgColor="gray.900">
        <Box boxShadow="2xl" borderRadius={10} bgColor="gray.800" padding={5}>
          {!failed ? (
            <>
              <Image
                src={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${fileName}`}
                onError={setFailed.on}
                borderRadius={5}
                alt="Uploaded image"
              />
              <HStack pt={2} justifyContent="center">
                <Icon as={BiImage} color="white" w={7} h={7} />
                <Text color="white" fontSize="2xl">
                  {fileName}
                </Text>
              </HStack>
            </>
          ) : (
            <Heading color="white">Failed to load image</Heading>
          )}
        </Box>
      </Center>
    </>
  );
}
