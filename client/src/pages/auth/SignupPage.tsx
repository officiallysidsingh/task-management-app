// React Router Imports
import { Link } from "react-router-dom";

// Zod Imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// React Hook Form Import
import { useForm } from "react-hook-form";

// ShadCN Imports
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First Name cannot be empty" })
      .max(20, { message: "First Name should be of max 20 character" }),
    lastName: z
      .string()
      .min(1, { message: "Last Name cannot be empty" })
      .max(20, { message: "First Name should be of max 20 character" }),
    email: z.string().email(),
    password: z
      .string()
      .min(3, { message: "Password should be of atleast 3 character" })
      .max(20, { message: "Password should be of max 20 character" }),
    confirmPassword: z
      .string()
      .min(3, { message: "Password should be of atleast 3 character" })
      .max(20, { message: "Password should be of max 20 character" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
  });

export default function SignupPage() {
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function signupUser(values: z.infer<typeof signupSchema>) {
    console.log(values);
  }

  function signupUserWithGoogle() {
    console.log("Signup User With Google");
  }

  return (
    <div className="flex justify-center pt-20">
      <div className="w-5/6 md:w-1/3 flex flex-col gap-2">
        <div>
          <h1 className="text-primary text-xl font-bold">Signup</h1>
        </div>
        <div className="flex flex-col p-4 gap-2 border-2 border-primary rounded-md shadow-md">
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(signupUser)}>
              <div className="flex flex-col gap-2">
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button>Signup</Button>
              </div>
            </form>
          </Form>
          <div className="flex flex-col justify-center items-center gap-2">
            <p>
              Already have an account?
              <Link to="/login" className="text-primary">
                {" "}
                Login
              </Link>
            </p>
            <Button onClick={signupUserWithGoogle}>
              <p>
                Signup with<span className="font-bold"> Google</span>
              </p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
