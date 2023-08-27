"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../_trpc/client";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { serverClient } from "../_trpc/serverClient";

const schema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email" })
});

type Schema = z.infer<typeof schema>;

export default function UserList({
  initialData
}: {
  initialData: Awaited<ReturnType<(typeof serverClient)["getUsers"]>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: ""
    }
  });
  console.log("errors", errors);
  const getUsers = trpc.getUsers.useQuery(undefined, {
    initialData,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const addUser = trpc.addUser.useMutation({
    onSettled: () => {
      getUsers.refetch();
    }
  });
  const onSubmit: SubmitHandler<Schema> = (data) => {
    addUser.mutate(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="First Name" {...register("firstName")} />
        {errors.firstName && (
          <span className="bg-red-200">{errors.firstName.message}</span>
        )}
        <input placeholder="Last name" {...register("lastName")} />
        {errors.lastName && (
          <span className="bg-red-200">{errors.lastName.message}</span>
        )}
        <input placeholder="Email" {...register("email")} />
        {errors.email && (
          <span className="bg-red-200">{errors.email.message}</span>
        )}
        <button type="submit">Add Yourself</button>
      </form>
      {getUsers.data?.map((user) => {
        return (
          <div key={user.id}>
            <h1>{user.firstName}</h1>
            <h1>{user.lastName}</h1>
            <h1>{user.email}</h1>
          </div>
        );
      })}
    </div>
  );
}
