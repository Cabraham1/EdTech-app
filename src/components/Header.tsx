"use client";

import {
  Box,
  Flex,
  Heading,
  Button,
  HStack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/students") {
      return (
        pathname === "/students" ||
        (pathname.startsWith("/students/") &&
          !pathname.startsWith("/students/new"))
      );
    }
    if (href === "/students/new") {
      return pathname === "/students/new";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <Box
      as="header"
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={3}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        justify="space-between"
        align="center"
      >
        <HStack spacing={8}>
          <Link href="/students">
            <Heading size="md" color="blue.600" cursor="pointer">
              EdTech SIMS
            </Heading>
          </Link>
          <HStack spacing={4} display={{ base: "none", md: "flex" }}>
            <Button
              as={Link}
              href="/students"
              variant={isActive("/students") ? "solid" : "ghost"}
              colorScheme="blue"
            >
              Students
            </Button>
            <Button
              as={Link}
              href="/students/new"
              variant={isActive("/students/new") ? "solid" : "ghost"}
              colorScheme="blue"
            >
              Add Student
            </Button>
          </HStack>
        </HStack>

        <HStack spacing={4}>
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                leftIcon={<Avatar size="sm" name={user.email} />}
                rightIcon={<Box />}
              >
                <Text
                  display={{ base: "none", md: "block" }}
                  maxW="150px"
                  isTruncated
                >
                  {user.email}
                </Text>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button as={Link} href="/login" colorScheme="blue">
              Login
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
