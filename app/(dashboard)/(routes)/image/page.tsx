"use client";
import axios from "axios";
import * as z from "zod";
import Heading from "@/components/heading";
import { Download, ImageIcon, Loader, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";

import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Empty } from "@/components/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";

const ConversationPage = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);
      // Make a POST request to your server-side API route
      const response = await axios.post("/api/image", values);
      console.log(response);
      const urls = response.data.map((image: { url: string }) => {
        return image.url;
      });
      setImages(urls);
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
        title="Image"
        description="Our most advanced image model"
        icon={ImageIcon}
        iconColor="text-green-500"
        bgColor="bg-green-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        placeholder="A picture of a horse in Swiss Alps"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value}></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => {
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value}></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => {
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader className="animate-spin" />
              </div>
            )}
            {images.length === 0 && !isLoading && (
              <Empty label={"No images generated"}></Empty>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {images.map((src) => (
                <Card key={src} className="rounded-lg overflow-hidden">
                  <div className="relative aspect-square">
                    <Image alt="image" fill src={src}></Image>
                  </div>
                  <CardFooter className="p-2">
                    <Button
                      onClick={() => window.open(src)}
                      variant="secondary"
                      className="w-full"
                    >
                      <Download></Download>Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationPage;
