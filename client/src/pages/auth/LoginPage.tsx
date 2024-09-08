// React Router Imports
import { Link, useNavigate } from "react-router-dom";

// Zod Imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// React Hook Form Imports
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

// Axios Imports
import axiosInstance from "@/config/axiosInstance";
import { AxiosError } from "axios";

// Types Imports
import ApiErrorResponse from "@/interfaces/axiosError";

// Context Imports
import { useAuth } from "@/AuthContext";

// Toast Imports
import { toast } from "sonner";

// GoogleOAuth Imports
import { GoogleLogin } from "@react-oauth/google";

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(3, { message: "Password should be of atleast 3 character" })
    .max(20, { message: "Password should be of max 20 character" }),
});

export default function LoginPage() {
  const { saveToken } = useAuth();

  const navigate = useNavigate();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function loginUser(values: z.infer<typeof loginSchema>) {
    axiosInstance
      .post("/user/login", values)
      .then((response) => {
        // Save access token
        saveToken(response?.data?.accessToken);

        // Go to homepage
        navigate("/");

        toast.success("Successfully signed in");
      })
      .catch((error: AxiosError<ApiErrorResponse>) => {
        if (error?.response?.status !== 500) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Error! Something Went Wrong!");
        }
      });
  }

  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    axiosInstance
      .post("/user/login/google", { idToken: credentialResponse.credential })
      .then((response) => {
        // Save access token
        saveToken(response.data.accessToken);

        // Go to homepage
        navigate("/");

        toast.success("Successfully signed in with Google");
      })
      .catch((error: AxiosError<ApiErrorResponse>) => {
        if (error?.response?.status !== 500) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Error! Something Went Wrong!");
        }
      });
  };

  const handleGoogleLoginError = () => {
    toast.error("Google Sign-In failed");
  };

  return (
    <div className="flex justify-center pt-20">
      <div className="w-5/6 md:w-1/3 flex flex-col gap-2">
        <div>
          <h1 className="text-primary text-xl font-bold">Login</h1>
        </div>
        <div className="flex flex-col p-4 gap-2 border-2 border-primary rounded-md shadow-md">
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
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap
            />
          </div>
        </div>
      </div>
    </div>
  );
}
