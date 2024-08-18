"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
// import { addPet, editPet } from "@/actions/actions";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";
import { petFormSchema, TPetForm } from "@/lib/validations";
// import { toast } from "sonner";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

// type TPetForm = {
//   name: string;
//   ownerName: string;
//   imageUrl: string;
//   age: number;
//   notes: string;
// };

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
    defaultValues:
      actionType === "edit"
        ? {
            name: selectedPet?.name,
            ownerName: selectedPet?.ownerName,
            imageUrl: selectedPet?.imageUrl,
            age: selectedPet?.age,
            notes: selectedPet?.notes,
          }
        : undefined,
  });

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   // We cannot use this since because of how formData it is typed
  //   // const newPet = Object.fromEntries(formData.entries());

  //   const newPetData = {
  //     name: formData.get("name") as string,
  //     ownerName: formData.get("ownerName") as string,
  //     imageUrl:
  //       (formData.get("imageUrl") as string) ||
  //       "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
  //     age: +(formData.get("age") as string),
  //     notes: formData.get("notes") as string,
  //   };

  //   if (actionType === "add") {
  //     await handleAddPet(newPetData);
  //   } else if (actionType === "edit") {
  //     handleEditPet(selectedPet!.id, newPetData);
  //   }
  //   onFormSubmission();
  // };

  return (
    <form
      className="flex flex-col"
      action={async (formData) => {
        const result = await trigger();
        if (!result) return;

        // const petData = {
        //   name: formData.get("name") as string,
        //   ownerName: formData.get("ownerName") as string,
        //   imageUrl:
        //     (formData.get("imageUrl") as string) ||
        //     "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
        //   age: Number(formData.get("age")),
        //   notes: formData.get("notes") as string,
        // };
        const petData = getValues();
        petData.imageUrl = petData.imageUrl || DEFAULT_PET_IMAGE;

        onFormSubmission();

        if (actionType === "add") {
          // const error = await addPet(formData);
          // if (error) {
          //   toast.warning(error.message);
          //   return;
          // }
          await handleAddPet(petData);
        }
        if (actionType === "edit") {
          // const error = await editPet(selectedPet?.id, formData);
          // if (error) {
          //   toast.warning(error.message);
          //   return;
          // }
          await handleEditPet(selectedPet!.id, petData);
        }
      }} /*onSubmit={handleSubmit}*/
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register(
              "name"
              // {
              //   required: "Name is required",
              //   minLength: {
              //     value: 3,
              //     message: "Name must be at least 3 characters long",
              //   },
              // }
            )}
            // name="name"
            // type="text"
            // required
            // defaultValue={actionType === "edit" ? selectedPet?.name : ""}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            {...register("ownerName")}
            // name="ownerName"
            // type="text"
            // required
            // defaultValue={actionType === "edit" ? selectedPet?.ownerName : ""}
          />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            {...register("imageUrl")}
            // name="imageUrl"
            // type="text"
            // defaultValue={actionType === "edit" ? selectedPet?.imageUrl : ""}
          />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            {...register("age")}
            // name="age"
            // type="number"
            // required
            // defaultValue={actionType === "edit" ? selectedPet?.age : ""}
          />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            // name="notes"
            // rows={3}
            // required
            // defaultValue={actionType === "edit" ? selectedPet?.notes : ""}
          />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
