"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
// import { PetEssentials } from "@/lib/types";
// import { sleep } from "@/lib/utils";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
// import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// --- user actions ---

export async function logIn(prevState: unknown, formData: unknown) {
  // await sleep(1000);

  // const authData = Object.fromEntries(formData.entries());

  // check if formData is FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  // // convert formData to an object
  // const formDataObject = Object.fromEntries(formData.entries());

  // await signIn("credentials", authData);
  // await signIn("credentials", formData);

  // Commented the below code since the authorize callback in NextAuth's config is hard typed as Record so we had to validated there
  // If needed will have to do the validation here too
  // // validate the object
  // const validatedFormDataObject = authSchema.safeParse(formDataObject);
  // if (!validatedFormDataObject.success) {
  //   return {
  //     message: "Invalid form data.",
  //   };
  // }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid credentials.",
          };
        }
        default: {
          return {
            message: "Could not sign in.",
          };
        }
      }
    }

    throw error; // nextjs redirects throws error, so we need to rethrow it
  }
}

// export async function signUp(formData: FormData) {
export async function signUp(prevState: unknown, formData: unknown) {
  // await sleep(1000);

  // check if formData is of FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  // convert formData to plain object
  const formDataEntries = Object.fromEntries(formData.entries());

  // validation
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return {
      message: "Invalid form data.",
    };
  }
  const { email, password } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(
    // formData.get("password") as string,
    password,
    10
  );

  try {
    await prisma.user.create({
      data: {
        // email: formData.get("email") as string,
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists.",
        };
      }
    }
    return {
      message: "Could not create user.",
    };
  }

  await signIn("credentials", formData);
}

export async function logOut() {
  // await sleep(1000);

  await signOut({ redirectTo: "/" });
}

// --- pet actions ---

export const addPet = async (pet: /*PetEssentials*/ unknown) => {
  // await sleep(1000);

  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return { message: "Invalid pet data." };
  }

  try {
    await prisma.pet.create({
      // data: {
      //   name: formData.get("name"),
      //   ownerName: formData.get("ownerName"),
      //   age: parseInt(formData.get("age")),
      //   imageUrl:
      //     formData.get("imageUrl") ||
      //     "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      //   notes: formData.get("notes"),
      // },
      // data: pet,
      // data: validatedPet.data,
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
};

export const editPet = async (
  petId: /*Pet["id"]*/ unknown,
  newPetData: /*PetEssentials*/ unknown
) => {
  // await sleep(1000);

  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPetId.success || !validatedPet.success) {
    return { message: "Invalid pet data." };
  }

  // authorization check
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized.",
    };
  }

  // database mutation
  try {
    await prisma.pet.update({
      where: {
        // id: petId,
        id: validatedPetId.data,
      },
      // data: {
      //   name: formData.get("name"),
      //   ownerName: formData.get("ownerName"),
      //   age: parseInt(formData.get("age")),
      //   imageUrl:
      //     formData.get("imageUrl") ||
      //     "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      //   notes: formData.get("notes"),
      // },
      // data: newPetData,
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Could not edit pet.",
    };
  }

  revalidatePath("/app", "layout");
};

export const deletePet = async (petId: /*Pet["id"]*/ unknown) => {
  // await sleep(1000);

  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return { message: "Invalid pet data." };
  }

  // authorization check
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized.",
    };
  }

  // database mutation
  try {
    await prisma.pet.delete({
      where: {
        // id: petId,
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet.",
    };
  }

  revalidatePath("/app", "layout");
};

// --- payment actions ---

export async function createCheckoutSession() {
  // authentication check
  const session = await checkAuth();

  // create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: "price_1PolvnBrjfNzfCYWGK0t1aYD",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=true`,
  });

  // redirect user
  redirect(checkoutSession.url);
}
