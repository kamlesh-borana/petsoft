import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import { Toaster } from "@/components/ui/sonner";
import PetContextProvider from "@/contexts/pet-context-provider";
import SearchContextProvider from "@/contexts/search-context-provider";
// import { Pet } from "@/lib/types";
import prisma from "@/lib/db";
import { checkAuth, getPetsByUserId } from "@/lib/server-utils";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const response = await fetch(
  //   "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
  // );
  // if (!response.ok) {
  //   throw new Error("Could not fetch pets");
  // }
  // const data: Pet[] = await response.json();

  // const pets = await prisma.pet.findMany();
  const session = await checkAuth();

  const pets = await getPetsByUserId(session.user.id);

  // const user = await prisma.user.findUnique({
  //   where: { email: "john@gmail.com" },
  //   include: { pets: true },
  // });

  return (
    <>
      <BackgroundPattern />

      <div className="max-w-[1050px] mx-auto px-4 flex flex-col min-h-screen">
        <AppHeader />

        <SearchContextProvider>
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>

        <AppFooter />
      </div>

      <Toaster position="top-right" />
    </>
  );
}
