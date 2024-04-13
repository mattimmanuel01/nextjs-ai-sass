"use client";
import axios from "axios";
import * as z from "zod";
import Heading from "@/components/heading";
import { Code, Loader, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Empty } from "@/components/empty";

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      // Make a POST request to your server-side API route
      const response = await axios.post(
        "/api/code",
        {
          messages: newMessages,
        },
        {
          timeout: 10000000, // Timeout of 10 seconds
        }
      );

      setMessages((current) => [...current, userMessage, response.data]);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      router.refresh();
    }
  };
  return (
    <>
      <Heading
        title="Code Generation"
        description="Generate code using text"
        icon={Code}
        iconColor="text-purple-500"
        bgColor="bg-purple-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Textarea
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        placeholder="Python code for pythagoras"
                        {...field}
                        disabled={isLoading}
                      ></Textarea>
                      {/* <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        placeholder="Python code for pythagoras"
                        {...field}
                        disabled={isLoading}
                      /> */}
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="col-span-12 lg:col-span-2 w-full flex items-center">
                <Button className="w-full" disabled={isLoading}>
                  Generate
                </Button>
              </div>
            </form>
          </Form>
          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader className="animate-spin" />
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <Empty label={"No conversation started..."}></Empty>
            )}
            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message, index) => (
                <div
                  key={`${message}${index}`}
                  className={cn(
                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                    message.role === "user"
                      ? "bg-white border border-black/10"
                      : "bg-muted"
                  )}
                >
                  {/* <p className="text-sm">{message.content}</p> */}
                  <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                          <pre {...props} />
                        </div>
                      ),
                    }}
                    className="text-sm overflow-hidden leading-7"
                  >
                    {message.content || ""}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodePage;
