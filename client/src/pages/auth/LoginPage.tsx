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

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(3, { message: "Password should be of atleast 3 character" })
    .max(20, { message: "Password should be of max 20 character" }),
});

export default function LoginPage() {
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function loginUser(values: z.infer<typeof loginSchema>) {
    console.log(values);
  }

  function loginUserWithGoogle() {
    console.log("Login with google");
  }

  return (
    <div className="flex justify-center pt-20">
      <div className="w-5/6 md:w-1/3 flex flex-col gap-2">
        <div>
          <h1 className="text-blue-600 text-xl font-bold">Login</h1>
        </div>
        <div className="flex flex-col p-4 gap-2 border-2 border-blue-600 rounded-md shadow-md">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(loginUser)}>
              <div className="flex flex-col gap-2">
                <FormField
                  control={loginForm.control}
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
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button>Login</Button>
              </div>
            </form>
          </Form>
          <div className="flex flex-col justify-center items-center gap-2">
            <p>
              Don't have an account?
              <Link to="/signup" className="text-primary">
                {" "}
                Signup
              </Link>
            </p>
            <Button onClick={loginUserWithGoogle}>
              <p>
                Login with<span className="font-bold"> Google</span>
              </p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
